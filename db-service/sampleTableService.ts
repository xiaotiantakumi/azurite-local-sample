import { DataSource } from "typeorm";
import { SampleTable } from "../entity/sampleTable";

export const getAll = async (
  dataSource: DataSource
): Promise<SampleTable[]> => {
  const query = dataSource
    .getRepository(SampleTable)
    .createQueryBuilder("sampleTable")
    .orderBy({
      "sampleTable.id": "ASC",
    });
  return query.getMany();
};
