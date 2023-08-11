import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class RecordableEntity {
  @CreateDateColumn({
    name: "created_at",
    comment: "作成日時",
  })
  readonly createdAt: Date | null | undefined;

  @Column({
    name: "created_by",
    type: "varchar",
    comment: "作成者",
    default: "system",
  })
  createdBy: string | null | undefined;

  @UpdateDateColumn({
    name: "updated_at",
    comment: "更新日時",
  })
  readonly updatedAt: Date | null | undefined;

  @Column({
    name: "updated_by",
    type: "varchar",
    comment: "更新者",
    default: "system",
  })
  updatedBy: string | null | undefined;
}
