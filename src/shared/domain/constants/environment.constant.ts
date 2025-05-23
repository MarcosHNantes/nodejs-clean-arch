import { envVariablesContainer } from "config/variables-container.config"

export const LOCAL = envVariablesContainer.environment === "development"
export const STAGING = envVariablesContainer.environment === "staging"
export const PRODUCTION = envVariablesContainer.environment === "production"
