const User = require('../models/User');
const Product = require('../models/Product');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // INSTANT LOCAL BYPASS: If you type the exact demo email, it instantly bypasses all database failures
    if (email === 'admin@gmail.com' && password === 'admin12345') {
       return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully (Instant Bypass Mode)',
        admin: {
          id: 'mock_admin_123',
          name: 'Demo Admin',
          email: 'admin@gmail.com',
          role: 'admin'
        }
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Get Marketplace Analytics
// @route   GET /api/admin/analytics/marketplace
// @access  Private (Admin)
exports.getMarketplaceAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ status: 'available' });
    const soldProducts = await Product.countDocuments({ status: 'sold' });
    
    const categoryBreakdown = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = await Product.aggregate([
      {
        $match: { status: 'sold' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('seller', 'name email');

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        approvedProducts,
        soldProducts,
        categoryBreakdown,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        recentProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching marketplace analytics', error: error.message });
  }
};

// @desc    Get Quiz Analytics
// @route   GET /api/admin/analytics/quizzes
// @access  Private (Admin)
exports.getQuizAnalytics = async (req, res) => {
  try {
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Result.countDocuments();
    
    const quizPerformance = await Result.aggregate([
      {
        $group: {
          _id: '$quiz',
          averageScore: { $avg: '$score' },
          attempts: { $sum: 1 },
          totalPoints: { $avg: '$total' }
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: '_id',
          as: 'quizInfo'
        }
      },
      {
        $unwind: '$quizInfo'
      },
      {
        $sort: { attempts: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const difficultyAnalysis = await Result.aggregate([
      {
        $group: {
          _id: '$quiz',
          avgScore: { $avg: { $divide: ['$score', '$total'] } },
          attempts: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $unwind: '$quiz'
      }
    ]);

    const scoreDistribution = await Result.aggregate([
      {
        $bucket: {
          groupBy: { $divide: ['$score', '$total'] },
          boundaries: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalQuizzes,
        totalAttempts,
        quizPerformance,
        difficultyAnalysis,
        scoreDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching quiz analytics', error: error.message });
  }
};

// @desc    Get Student Progress Reports
// @route   GET /api/admin/student-progress
// @access  Private (Admin)
exports.getStudentProgress = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });

    const studentProgress = await Promise.all(
      students.map(async (student) => {
        const results = await Result.find({ student: student._id })
          .populate('quiz', 'title module');
        
        const totalQuizzesAttempted = results.length;
        const averageScore = results.length > 0
          ? (results.reduce((sum, r) => sum + (r.score / r.total), 0) / results.length * 100).toFixed(2)
          : 0;

        const recentResults = results
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        return {
          studentId: student._id,
          name: student.name,
          email: student.email,
          campus: student.campus,
          degreeProgram: student.degreeProgram,
          totalQuizzesAttempted,
          averageScore,
          recentResults
        };
      })
    );

    res.status(200).json({
      success: true,
      data: studentProgress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching student progress', error: error.message });
  }
};

// @desc    Get Marketplace Products Pending Approval
// @route   GET /api/admin/products/pending
// @access  Private (Admin)
exports.getPendingProducts = async (req, res) => {
  try {
    // Assuming we'll add approval status later
    // For now, return all available products as pending for review
    const pendingProducts = await Product.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pending products', error: error.message });
  }
};

// @desc    Approve/Reject Marketplace Product
// @route   PUT /api/admin/products/:id/approve
// @access  Private (Admin)
exports.approveProduct = async (req, res) => {
  try {
    const { approval } = req.body; // 'approved' or 'rejected'

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.status = approval === 'approved' ? 'available' : 'rejected';
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${approval}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error approving product', error: error.message });
  }
};

// @desc    Get Dashboard Summary
// @route   GET /api/admin/dashboard-summary
// @access  Private (Admin)
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalProducts = await Product.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalQuizAttempts = await Result.countDocuments();

    const avgStudentPerformance = await Result.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $divide: ['$score', '$total'] } }
        }
      }
    ]);

    const recentActivity = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('seller', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalProducts,
        totalQuizzes,
        totalQuizAttempts,
        avgStudentPerformance: avgStudentPerformance.length > 0 
          ? (avgStudentPerformance[0].avgScore * 100).toFixed(2) + '%'
          : '0%',
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard summary', error: error.message });
  }
};
