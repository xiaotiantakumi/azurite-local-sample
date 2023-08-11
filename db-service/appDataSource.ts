import { DataSource } from "typeorm";

const entityPath: string = process.env.ENTITY_PATH ?? "dist/entity/*.js";
const appDataSource: DataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [entityPath],
  migrations: [],
  subscribers: [],
});

export const getInitializedAppDataSource = async () => {
  await setUp();
  return appDataSource;
};

const setUp = async () => {
  if (appDataSource.isInitialized) {
    return;
  }
  await appDataSource.initialize().catch((error) => {
    console.log(error);
  });
};
export const destroy = async () => {
  if (!appDataSource.isInitialized) return;
  await appDataSource.destroy().catch((error) => {
    console.log(error);
  });
};
