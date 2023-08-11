export default (): void => {
  process.env.DB_HOST = "localhost";
  process.env.DB_NAME = "db";
  process.env.DB_USER = "root";
  process.env.DB_PASSWORD = "root";
  process.env.ENTITY_PATH = "entity/*.ts";
  return;
};
