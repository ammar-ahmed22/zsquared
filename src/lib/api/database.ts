import { notion } from "../notion/client";

type DatabaseQueryParams = Omit<
  Parameters<(typeof notion)["databases"]["query"]>[0],
  "database_id"
>;

type DatabaseRetreiveParams = Omit<
  Parameters<(typeof notion)["databases"]["retrieve"]>[0],
  "database_id"
>;

type DatabaseUpdateParams = Omit<
  Parameters<(typeof notion)["databases"]["update"]>[0],
  "database_id"
>;

class Database {
  constructor(private database_id: string) {}
  async query(args?: DatabaseQueryParams) {
    return notion.databases.query({
      database_id: this.database_id,
      ...args,
    });
  }

  async retrieve(args?: DatabaseRetreiveParams) {
    return notion.databases.retrieve({
      database_id: this.database_id,
      ...args,
    });
  }

  async update(args?: DatabaseUpdateParams) {
    return notion.databases.update({
      database_id: this.database_id,
      ...args,
    });
  }
}

if (!process.env.BLOG_DB_ID) {
  throw new Error(
    "Please set the BLOG_DATABASE_ID environment variable",
  );
}

export const databases = {
  blog: new Database(process.env.BLOG_DB_ID),
};
