import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RecordableEntity } from "./recordableEntity";

@Entity("sample_table")
export class SampleTable {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number | null | undefined;

  @Column({ type: "varchar", comment: "名前" })
  name: string | null | undefined;

  @Column({
    name: "age",
    type: "integer",
    comment: "年齢",
  })
  age: number | null | undefined;

  @Column({ type: "varchar", comment: "住所" })
  address: string | null | undefined;

  @Column(() => RecordableEntity, { prefix: "" })
  recordableEntity: RecordableEntity | null | undefined;
}
