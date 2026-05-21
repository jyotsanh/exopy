import { Branch } from "../models/branch.model.js";
import { Region } from "../models/region.model.js";
import { PaginationQuery } from "../types/branch/index.js";
import HttpException from "../utils/httpException.utils.js";

export class BranchService {
  static async create(
    orgId: string,
    regionId: string,
    data: {
      name: string;
      address?: string;
      email?: string;
      contact_number?: string;
    },
    userId: string
  ) {
    const region = await Region.findOne({
      _id: regionId,
      org_id: orgId,
      is_deleted: false,
    });

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    const existingBranch = await Branch.findOne({
      name: data.name,
      reg_id: regionId,
      is_deleted: false,
    });

    if (existingBranch) {
      throw HttpException.conflict(
        "Branch with this name already exists in this region."
      );
    }

    const branch = new Branch({
      ...data,
      reg_id: regionId,
      created_by: userId,
    });

    await branch.save();

    return {
      success: true,
      message: "Branch created successfully",
      data: branch,
    };
  }

  static async getAll(
    orgId: string,
    regionId: string,
    query: PaginationQuery
  ) {
    const region = await Region.findOne({
      _id: regionId,
      org_id: orgId,
      is_deleted: false,
    });

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      reg_id: regionId,
      is_deleted: false,
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const [branches, total] = await Promise.all([
      Branch.find(filter)
        .populate("created_by", "username email")
        .populate("updated_by", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Branch.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: "Branches fetched successfully",
      data: branches,
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

  static async getById(orgId: string, regionId: string, id: string) {
    const region = await Region.findOne({
      _id: regionId,
      org_id: orgId,
      is_deleted: false,
    });

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    const branch = await Branch.findOne({
      _id: id,
      reg_id: regionId,
      is_deleted: false,
    })
      .populate("created_by", "username email")
      .populate("updated_by", "username email");

    if (!branch) {
      throw HttpException.notFound("Branch not found.");
    }

    return {
      success: true,
      message: "Branch fetched successfully",
      data: branch,
    };
  }

  static async update(
    orgId: string,
    regionId: string,
    id: string,
    data: {
      name?: string;
      address?: string;
      email?: string;
      contact_number?: string;
    },
    userId: string
  ) {
    const region = await Region.findOne({
      _id: regionId,
      org_id: orgId,
      is_deleted: false,
    });

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    const branch = await Branch.findOne({
      _id: id,
      reg_id: regionId,
      is_deleted: false,
    });

    if (!branch) {
      throw HttpException.notFound("Branch not found.");
    }

    if (data.name && data.name !== branch.name) {
      const existingBranch = await Branch.findOne({
        name: data.name,
        reg_id: regionId,
        is_deleted: false,
        _id: { $ne: id },
      });

      if (existingBranch) {
        throw HttpException.conflict(
          "Another branch with this name already exists in this region."
        );
      }
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
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
      message: "Branch updated successfully",
      data: updatedBranch,
    };
  }

  static async delete(
    orgId: string,
    regionId: string,
    id: string,
    userId: string
  ) {
    const region = await Region.findOne({
      _id: regionId,
      org_id: orgId,
      is_deleted: false,
    });

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    const branch = await Branch.findOne({
      _id: id,
      reg_id: regionId,
      is_deleted: false,
    });

    if (!branch) {
      throw HttpException.notFound("Branch not found.");
    }

    await Branch.findByIdAndUpdate(id, {
      is_deleted: true,
      updated_by: userId,
    });

    return {
      success: true,
      message: "Branch deleted successfully",
    };
  }
}
