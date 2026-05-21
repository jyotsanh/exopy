import { Region } from "../models/region.model.js";
import { Organization } from "../models/organization.model.js";
import { PaginationQuery } from "../types/region/index.js";
import HttpException from "../utils/httpException.utils.js";

export class RegionService {
  static async create(
    orgId: string,
    data: {
      name: string;
      email?: string;
      contact_number?: string;
    },
    userId: string
  ) {
    const organization = await Organization.findOne({
      _id: orgId,
      is_deleted: false,
    });

    if (!organization) {
      throw HttpException.notFound("Organization not found.");
    }

    const existingRegion = await Region.findOne({
      name: data.name,
      org_id: orgId,
      is_deleted: false,
    });

    if (existingRegion) {
      throw HttpException.conflict(
        "Region with this name already exists in this organization."
      );
    }

    const region = new Region({
      ...data,
      org_id: orgId,
      created_by: userId,
    });

    await region.save();

    return {
      success: true,
      message: "Region created successfully",
      data: region,
    };
  }

  static async getAll(orgId: string, query: PaginationQuery) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      org_id: orgId,
      is_deleted: false,
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [regions, total] = await Promise.all([
      Region.find(filter)
        .populate("created_by", "username email")
        .populate("updated_by", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Region.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: "Regions fetched successfully",
      data: regions,
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

  static async getById(orgId: string, id: string) {
    const region = await Region.findOne({
      _id: id,
      org_id: orgId,
      is_deleted: false,
    })
      .populate("created_by", "username email")
      .populate("updated_by", "username email");

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    return {
      success: true,
      message: "Region fetched successfully",
      data: region,
    };
  }

  static async update(
    orgId: string,
    id: string,
    data: {
      name?: string;
      email?: string;
      contact_number?: string;
    },
    userId: string
  ) {
    const region = await Region.findOne({
      _id: id,
      org_id: orgId,
      is_deleted: false,
    });

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    if (data.name && data.name !== region.name) {
      const existingRegion = await Region.findOne({
        name: data.name,
        org_id: orgId,
        is_deleted: false,
        _id: { $ne: id },
      });

      if (existingRegion) {
        throw HttpException.conflict(
          "Another region with this name already exists in this organization."
        );
      }
    }

    const updatedRegion = await Region.findByIdAndUpdate(
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
      message: "Region updated successfully",
      data: updatedRegion,
    };
  }

  static async delete(orgId: string, id: string, userId: string) {
    const region = await Region.findOne({
      _id: id,
      org_id: orgId,
      is_deleted: false,
    });

    if (!region) {
      throw HttpException.notFound("Region not found.");
    }

    await Region.findByIdAndUpdate(id, {
      is_deleted: true,
      updated_by: userId,
    });

    return {
      success: true,
      message: "Region deleted successfully",
    };
  }
}
