import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin, { IAdmin } from './auth.model';

export const generateToken = (id: string, email: string, name: string): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  const secret = process.env.JWT_SECRET || (isProduction ? '' : 'merald_group_enterprise_secret_jwt_key_2026_super_secure');

  if (!secret && isProduction) {
    throw new Error('JWT_SECRET environment variable is missing');
  }

  return jwt.sign(
    { id, email, name },
    secret || 'merald_group_enterprise_secret_jwt_key_2026_super_secure',
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
  );
};

// Clean in-memory fallback list (starts empty with ZERO hardcoded admins)
let inMemoryAdmins: any[] = [];

export class AuthService {
  // Check if system has 0 admins
  static async getSetupStatus() {
    let count = 0;
    try {
      count = await Admin.countDocuments();
    } catch (err) {
      if (process.env.NODE_ENV === 'production') throw err;
      count = inMemoryAdmins.length;
    }
    return {
      setupRequired: count === 0,
      totalAdmins: count,
    };
  }

  // Secure First-Admin Setup (Only allowed when 0 admins exist)
  static async setupFirstAdmin(data: any) {
    const status = await this.getSetupStatus();
    if (!status.setupRequired) {
      throw new Error('Initial admin setup has already been completed. Public setup is disabled.');
    }

    const { name, email, country, city, officeAddress, password } = data;

    try {
      const admin = await Admin.create({
        name,
        email: email.toLowerCase(),
        country,
        city,
        officeAddress,
        password,
        status: 'ACTIVE',
      });

      const token = generateToken(admin._id.toString(), admin.email, admin.name);
      return {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          country: admin.country,
          city: admin.city,
          officeAddress: admin.officeAddress,
          status: admin.status,
          createdAt: admin.createdAt,
        },
      };
    } catch (dbErr: any) {
      if (process.env.NODE_ENV === 'production') throw dbErr;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const mock = {
        _id: 'admin_' + Date.now(),
        name,
        email: email.toLowerCase(),
        country,
        city,
        officeAddress,
        passwordHash: hash,
        status: 'ACTIVE',
        createdAt: new Date(),
      };
      inMemoryAdmins.push(mock);
      const token = generateToken(mock._id, mock.email, mock.name);
      return {
        token,
        admin: {
          id: mock._id,
          name: mock.name,
          email: mock.email,
          country: mock.country,
          city: mock.city,
          officeAddress: mock.officeAddress,
          status: mock.status,
          createdAt: mock.createdAt,
        },
      };
    }
  }

  // Login Admin
  static async loginAdmin(email: string, pass: string) {
    const cleanEmail = email.toLowerCase().trim();

    try {
      const admin = await Admin.findOne({ email: cleanEmail });
      if (admin) {
        if (admin.status === 'DISABLED') {
          throw new Error('This admin account has been disabled. Please contact your system administrator.');
        }

        if (await admin.matchPassword(pass)) {
          const token = generateToken(admin._id.toString(), admin.email, admin.name);
          return {
            token,
            admin: {
              id: admin._id,
              name: admin.name,
              email: admin.email,
              country: admin.country,
              city: admin.city,
              officeAddress: admin.officeAddress,
              status: admin.status,
            },
          };
        }
      }
    } catch (dbErr: any) {
      if (dbErr.message && dbErr.message.includes('disabled')) throw dbErr;
      if (process.env.NODE_ENV === 'production') throw dbErr;

      // In-memory fallback for local dev
      const found = inMemoryAdmins.find((a) => a.email === cleanEmail);
      if (found) {
        if (found.status === 'DISABLED') {
          throw new Error('This admin account has been disabled.');
        }
        const match = await bcrypt.compare(pass, found.passwordHash);
        if (match) {
          const token = generateToken(found._id, found.email, found.name);
          return {
            token,
            admin: {
              id: found._id,
              name: found.name,
              email: found.email,
              country: found.country,
              city: found.city,
              officeAddress: found.officeAddress,
              status: found.status,
            },
          };
        }
      }
    }

    throw new Error('Invalid email address or password.');
  }

  // Admin Management — Get All Admins
  static async getAllAdmins() {
    try {
      const list = await Admin.find().select('-password').sort({ createdAt: -1 });
      return list;
    } catch (err) {
      if (process.env.NODE_ENV === 'production') throw err;
      return inMemoryAdmins.map(({ passwordHash, ...rest }) => rest);
    }
  }

  // Admin Management — Create Secondary Admin (by authenticated admin)
  static async createAdminByAdmin(data: any) {
    const { name, email, country, city, officeAddress, password } = data;
    const cleanEmail = email.toLowerCase().trim();

    try {
      const existing = await Admin.findOne({ email: cleanEmail });
      if (existing) {
        throw new Error(`An admin account with email ${cleanEmail} already exists`);
      }

      const admin = await Admin.create({
        name,
        email: cleanEmail,
        country,
        city,
        officeAddress,
        password,
        status: 'ACTIVE',
      });

      return {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        country: admin.country,
        city: admin.city,
        officeAddress: admin.officeAddress,
        status: admin.status,
        createdAt: admin.createdAt,
      };
    } catch (dbErr: any) {
      if (dbErr.message && dbErr.message.includes('already exists')) throw dbErr;
      if (process.env.NODE_ENV === 'production') throw dbErr;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const mock = {
        _id: 'admin_' + Date.now(),
        name,
        email: cleanEmail,
        country,
        city,
        officeAddress,
        passwordHash: hash,
        status: 'ACTIVE',
        createdAt: new Date(),
      };
      inMemoryAdmins.push(mock);
      const { passwordHash, ...rest } = mock;
      return rest;
    }
  }

  // Admin Management — Update Admin Profile or Status
  static async updateAdmin(id: string, updates: any) {
    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
    }

    // Password change support
    if (updates.password && updates.password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    } else {
      delete updates.password;
    }

    try {
      const updated = await Admin.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!updated) throw new Error('Admin account not found');
      return updated;
    } catch (err: any) {
      if (err.message && err.message.includes('not found')) throw err;
      if (process.env.NODE_ENV === 'production') throw err;

      const idx = inMemoryAdmins.findIndex((a) => a._id === id);
      if (idx === -1) throw new Error('Admin account not found');
      if (updates.password) {
        updates.passwordHash = updates.password;
        delete updates.password;
      }
      inMemoryAdmins[idx] = { ...inMemoryAdmins[idx], ...updates };
      const { passwordHash, ...rest } = inMemoryAdmins[idx];
      return rest;
    }
  }

  // Admin Management — Delete / Disable Admin Account
  static async deleteAdmin(id: string, currentAdminId: string) {
    let activeCount = 0;
    try {
      activeCount = await Admin.countDocuments({ status: 'ACTIVE' });
    } catch (err) {
      if (process.env.NODE_ENV === 'production') throw err;
      activeCount = inMemoryAdmins.filter((a) => a.status === 'ACTIVE').length;
    }

    if (activeCount <= 1) {
      throw new Error('Cannot remove the last active administrator from the system.');
    }

    try {
      const deleted = await Admin.findByIdAndDelete(id);
      if (!deleted) throw new Error('Admin account not found');
      return true;
    } catch (err: any) {
      if (err.message && err.message.includes('not found')) throw err;
      if (process.env.NODE_ENV === 'production') throw err;

      const idx = inMemoryAdmins.findIndex((a) => a._id === id);
      if (idx === -1) throw new Error('Admin account not found');
      inMemoryAdmins.splice(idx, 1);
      return true;
    }
  }
}
