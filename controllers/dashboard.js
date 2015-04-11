/**
 * GET /
 * Dashboard page.
 */
exports.index = function(req, res) {
  res.render('dashboard', {
    title: 'Dashboard'
  });
};

/**
 * GET /dashboard
 * Dashboard page.
 */
exports.getDashboard = function(req, res) {
  res.render('Dashboard', {
    title: 'Dashboard'
  });
};