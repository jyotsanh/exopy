import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";
import HttpException from "../utils/httpException.utils.js";
import { Role } from "../constants/enum.js";

export interface AdminPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  org_id?: string;
}

export class AdminService {
  static async getAll(query: AdminPaginationQuery) {
    const { page = 1, limit = 10, search, org_id } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      is_deleted: false,
      role: Role.ADMIN,
    };

    if (org_id) {
      filter.org_id = org_id;
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [admins, total] = await Promise.all([
      User.find(filter)
        .populate("org_id", "name email")
        .populate("created_by", "username email")
        .populate("updated_by", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: "Admins fetched successfully",
      data: admins,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getById(id: string) {
    const admin = await User.findOne({
      _id: id,
      is_deleted: false,
      role: Role.ADMIN,
    })
      .populate("org_id", "name email")
      .populate("created_by", "username email")
      .populate("updated_by", "username email");

    if (!admin) {
      throw HttpException.notFound("Admin not found.");
    }

    return {
      success: true,
      message: "Admin fetched successfully",
      data: admin,
    };
  }

  static async update(
    id: string,
    data: {
      username?: string;
      email?: string;
      profile_image?: string;
      org_id?: string;
    },
    actingUserId: string
  ) {
    const admin = await User.findOne({
      _id: id,
      is_deleted: false,
      role: Role.ADMIN,
    });
    if (!admin) {
      throw HttpException.notFound("Admin not found.");
    }

    if (data.email && data.email !== admin.email) {
      const exists = await User.findOne({
        email: data.email,
        is_deleted: false,
        _id: { $ne: id },
      });
      if (exists) {
        throw HttpException.conflict(
          "Another user with this email already exists."
        );
      }
    }

    if (data.username && data.username !== admin.username) {
      const exists = await User.findOne({
        username: data.username,
        is_deleted: false,
        _id: { $ne: id },
      });
      if (exists) {
        throw HttpException.conflict(
          "Another user with this username already exists."
        );
      }
    }

    if (data.org_id) {
      const org = await Organization.findOne({
        _id: data.org_id,
        is_deleted: false,
      });
      if (!org) {
        throw HttpException.badRequest("Organization not found.");
      }
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { ...data, updated_by: actingUserId },
      { new: true, runValidators: true }
    )
      .populate("org_id", "name email")
      .populate("created_by", "username email")
      .populate("updated_by", "username email");

    return {
      success: true,
      message: "Admin updated successfully",
      data: updated,
    };
  }

  static async delete(id: string, actingUserId: string) {
    const admin = await User.findOne({
      _id: id,
      is_deleted: false,
      role: Role.ADMIN,
    });
    if (!admin) {
      throw HttpException.notFound("Admin not found.");
    }

    await User.findByIdAndUpdate(id, {
      is_deleted: true,
      updated_by: actingUserId,
    });

    return {
      success: true,
      message: "Admin deleted successfully",
    };
  }

  static async resetPassword(
    id: string,
    newPassword: string,
    actingUserId: string
  ) {
    const admin = await User.findOne({
      _id: id,
      is_deleted: false,
      role: Role.ADMIN,
    });
    if (!admin) {
      throw HttpException.notFound("Admin not found.");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, {
      password: hashed,
      updated_by: actingUserId,
    });

    return {
      success: true,
      message: "Password reset successfully",
    };
  }
}
