module.exports = process.env.TEST_COV ?
  require('./lib-cov/pusherman') :
  require('./lib/pusherman');
