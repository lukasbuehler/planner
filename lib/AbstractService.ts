export default abstract class AbstractService {
  /**
   * Authenticates the user against the service.
   */
  abstract authenticate(originPath?: string): Promise<void>;

  /**
   * Checks if the user is authenticated against the service.
   */
  abstract isAuthenticated(): boolean;

  abstract logout(): Promise<void>;
}
