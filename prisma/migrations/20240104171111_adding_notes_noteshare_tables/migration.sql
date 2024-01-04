-- CreateTable
CREATE TABLE "note" (
    "note_id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT NOT NULL,
    "updated_on" TIMESTAMP(3),
    "updated_by" BIGINT,

    CONSTRAINT "note_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "noteShare" (
    "note_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "noteShare_pkey" PRIMARY KEY ("note_id","user_id")
);

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noteShare" ADD CONSTRAINT "noteShare_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("note_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noteShare" ADD CONSTRAINT "noteShare_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
