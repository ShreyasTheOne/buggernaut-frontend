
//Front-end routes

export function urlAppBase() {
    return "http://localhost:3000";
}

export function urlAppLogin() {
    return `${urlAppBase()}/login`;
}

export function urlAppOnLogin() {
    return `${urlAppBase()}/onlogin`;
}

export function urlAppDashboard() {
  return `${urlAppBase()}/dashboard`
}

export function urlAppDashboardCurrentProjects() {
  return `${urlAppBase()}/dashboard/?display=current-projects`
}

export function urlAppDashboardDeployedProjects() {
  return `${urlAppBase()}/dashboard/?display=deployed-projects`
}

export function urlAppDashboardAddProject() {
  return `${urlAppBase()}/dashboard/?display=add-project`
}

export function urlAppProjectDetail(slug) {
  return `${urlAppBase()}/projects/${slug}`
}

export function urlAppAddIssue() {
  return `${urlAppBase()}/report`
}

export function urlAppAdmin() {
  return `${urlAppBase()}/admin`
}

export function urlAppMyPage() {
  return `${urlAppBase()}/mypage`
}

export function urlAppMyAssignments() {
  return `${urlAppBase()}/mypage/?show=my-assignments`
}

export function urlMyReports() {
  return `${urlAppBase()}/mypage/?show=my-reports`
}


//Back-end routes
export function urlApiBase() {
  return 'http://localhost:8000';
}

export function urlApiUsers() {
  return `${urlApiBase()}/users/`;
}

export function urlApiUserOnLogin() {
  return `${urlApiBase()}/users/onlogin/`;
}

export function urlApiUserLogout() {
  return `${urlApiBase()}/users/logout_user/`;
}

export function urlApiUserToggleBan(user_id) {
  return `${urlApiBase()}/users/${user_id}/toggleBan/`;
}

export function urlApiUserToggleStatus(user_id) {
  return `${urlApiBase()}/users/${user_id}/toggleStatus/`;
}

export function urlApiProjects() {
  return `${urlApiBase()}/projects/`;
}

export function urlApiProjectById(id) {
  return `${urlApiBase()}/projects/${id}/`;
}

export function urlApiProjectBySlug(slug) {
  return `${urlApiBase()}/projects/?slug=${slug}`;
}

export function urlApiProjectByDeployedState(state) {
  return `${urlApiBase()}/projects/?deployed=${state}`;
}

export function urlApiProjectIssues(project_id) {
  return `${urlApiBase()}/projects/${project_id}/issues/`;
}

export function urlApiProjectVerifySlug(slug) {
  return `${urlApiBase()}/projects/verify/?slug=${slug}`;
}

export function urlApiProjectDeploy(project_id) {
  return `${urlApiBase()}/projects/${project_id}/deploy/`;
}

export function urlApiTags() {
  return `${urlApiBase()}/tags/`;
}

export function urlApiIssues() {
  return `${urlApiBase()}/issues/`;
}

export function urlApiIssueDetail(issue_id) {
  return `${urlApiBase()}/issues/${issue_id}/`;
}

export function urlApiAssignIssue(issue_id, assign_to_member) {
  return `${urlApiBase()}/issues/${issue_id}/assign/?assign_to=${assign_to_member}`;
}

export function urlApiReopenResolveIssue(issue_id) {
  return `${urlApiBase()}/issues/${issue_id}/resolve-or-reopen/`;
}

export function urlApiIssuesAssignedToUser(user_id) {
  return `${urlApiBase()}/issues/?assigned_to=${user_id}`;
}

export function urlApiIssuesReportedByUser(user_id) {
  return `${urlApiBase()}/issues/?reported_to=${user_id}`;
}

export function urlApiImages() {
  return `${urlApiBase()}/images/`;
}

export function urlApiDeleteRemainingImages() {
  return `${urlApiBase()}/images/deleteRem/`;
}

export function urlApiIssueComments(issue_id) {
  return `${urlApiBase()}/issues/${issue_id}/comments/`;
}


// Back-end Web-socket routes

export function urlApiWSBase() {
  return 'ws://127.0.0.1:8000/ws';
}

export function urlApiWSProjectComments(project_id) {
  return `${urlApiWSBase()}/projects/${project_id}/comments/`;
}