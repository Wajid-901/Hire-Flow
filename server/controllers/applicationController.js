import Application from "../models/applicationModel.js";

const APPLICATION_FIELDS = [
  "companyName",
  "jobRole",
  "jobLink",
  "appliedDate",
  "status",
  "source",
  "location",
  "workType",
  "resumeVersion",
  "priority",
  "notes",
  "followUpDate",
  "interviewDate",
];

const trimIfString = (value) =>
  typeof value === "string" ? value.trim() : value;

const buildCreatePayload = (body) => {
  const payload = {};

  for (const key of APPLICATION_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, key)) continue;

    const value = body[key];

    if (key === "appliedDate") {
      if (value === "" || value === undefined || value === null) continue;
      payload[key] = value;
      continue;
    }

    if (key === "followUpDate" || key === "interviewDate") {
      payload[key] =
        value === "" || value === undefined || value === null ? null : value;
      continue;
    }

    payload[key] = trimIfString(value);
  }

  return payload;
};

const buildUpdatePayload = (body) => {
  const payload = {};

  for (const key of APPLICATION_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, key)) continue;

    const value = body[key];

    if (key === "appliedDate") {
      if (value === "" || value === undefined || value === null) continue;
      payload[key] = value;
      continue;
    }

    if (key === "followUpDate" || key === "interviewDate") {
      payload[key] =
        value === "" || value === undefined || value === null ? null : value;
      continue;
    }

    payload[key] = trimIfString(value);
  }

  return payload;
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = buildCreatePayload(req.body);
    data.user = userId;

    const application = await Application.create(data);

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create application",
      error: error.message,
    });
  }
};

// @desc    Get all applications of logged-in user
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    const { userId } = req.user;

    const applications = await Application.find({
      user: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const application = await Application.findOne({
      _id: id,
      user: userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const application = await Application.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: error.message,
    });
  }
};

// @desc    Update application
// @route   PATCH /api/applications/:id
// @access  Private
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const updates = buildUpdatePayload(req.body);

    if ("interviewDate" in updates) {
      updates.reminder24hSent = false;
      updates.reminder1hSent = false;
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update application",
      error: error.message,
    });
  }
};