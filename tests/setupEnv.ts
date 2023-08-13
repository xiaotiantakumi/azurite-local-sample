export default (): void => {
  process.env.DB_HOST = "localhost";
  process.env.DB_NAME = "db";
  process.env.DB_USER = "root";
  process.env.DB_PASSWORD = "root";
  process.env.ENTITY_PATH = "entity/*.ts";
  process.env.STORAGE_CONNECTION_STRING =
    "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;";
  return;
};
