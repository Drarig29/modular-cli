function getCiCommitSha() {
  return process.env.CI_COMMIT_SHA ?? "local";
}

module.exports = { getCiCommitSha };
