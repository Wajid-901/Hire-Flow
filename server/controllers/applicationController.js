import Application from "../models/applicationModel.js";

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  try {
    const { userId } = req.user;

    const application = await Application.create({
      ...req.body,
      user: userId,
    });

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

    // Allowlist — only these fields may be updated. Prevents field injection
    // (e.g. a client sending { user: "otherUserId" } to hijack ownership).
    const ALLOWED = [
      "companyName", "jobRole", "jobLink", "appliedDate", "status",
      "source", "location", "workType", "resumeVersion", "priority",
      "notes", "followUpDate",
    ];
    const updates = {};
    for (const key of ALLOWED) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, user: userId },        // filter: ownership enforced at DB level
      { $set: updates },                 // explicit $set of allowlisted fields only
      { new: true, runValidators: true } // new: return updated doc; runValidators: enforce schema rules
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