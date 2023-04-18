alter table "titulos" add column "external_code" varchar(255) not null;

create unique index "titulos_external_code_key" ON "titulos"("external_code");
