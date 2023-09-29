import eccubeReduxEventHistory from "./EccubeReduxEventHistory";
import ErrorOrganizationMiddleware from "./ErrorOrganizationMiddleware";

const EccubeMiddlewareHub = [
    eccubeReduxEventHistory,
    ErrorOrganizationMiddleware
]

export default EccubeMiddlewareHub
