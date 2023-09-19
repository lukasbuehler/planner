export default abstract class AbstractService {
  /**
   * Authenticates the user against the service.
   */
  abstract authenticate(originPath: string): void;

  /**
   * Checks if the user is authenticated against the service.
   */
  abstract isAuthenticated(): boolean;
}
