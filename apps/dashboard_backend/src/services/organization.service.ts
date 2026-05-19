import { Organization } from "../models/organization.model.js";
import { IOrganization, PaginationQuery } from "../types/organization/index.js";
import HttpException from "../utils/httpException.utils.js";

export class OrganizationService {
  static async create(
    data: {
      name: string;
      email: string;
      address?: string;
      contact_number?: string;
    },
    userId: string
  ) {
    const existingOrg = await Organization.findOne({
      email: data.email,
      is_deleted: false,
    });

    if (existingOrg) {
      throw HttpException.conflict("Organization with this email already exists.");
    }

    const organization = new Organization({
      ...data,
      created_by: userId,
    });

    await organization.save();

    return {
      success: true,
      message: "Organization created successfully",
      data: organization,
    };
  }

  static async getAll(query: PaginationQuery) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { is_deleted: false };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const [organizations, total] = await Promise.all([
      Organization.find(filter)
        .populate("created_by", "username email")
        .populate("updated_by", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Organization.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: "Organizations fetched successfully",
      data: organizations,
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

  // Get by ID
  static async getById(id: string) {
    const organization = await Organization.findOne({
      _id: id,
      is_deleted: false,
    })
      .populate("created_by", "username email")
      .populate("updated_by", "username email");

    if (!organization) {
      throw HttpException.notFound("Organization not found.");
    }

    return {
      success: true,
      message: "Organization fetched successfully",
      data: organization,
    };
  }

  static async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      address?: string;
      contact_number?: string;
    },
    userId: string
  ) {
    const organization = await Organization.findOne({
      _id: id,
      is_deleted: false,
    });

    if (!organization) {
      throw HttpException.notFound("Organization not found.");
    }

    // Check if email is being changed and already exists
    if (data.email && data.email !== organization.email) {
      const existingOrg = await Organization.findOne({
        email: data.email,
        is_deleted: false,
        _id: { $ne: id },
      });

      if (existingOrg) {
        throw HttpException.conflict(
          "Another organization with this email already exists."
        );
      }
    }

    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      {
        ...data,
        updated_by: userId,
      },
      { new: true, runValidators: true }
    )
      .populate("created_by", "username email")
      .populate("updated_by", "username email");

    return {
      success: true,
      message: "Organization updated successfully",
      data: updatedOrganization,
    };
  }

  static async delete(id: string, userId: string) {
    const organization = await Organization.findOne({
      _id: id,
      is_deleted: false,
    });

    if (!organization) {
      throw HttpException.notFound("Organization not found.");
    }

    await Organization.findByIdAndUpdate(id, {
      is_deleted: true,
      updated_by: userId,
    });

    return {
      success: true,
      message: "Organization deleted successfully",
    };
  }
}