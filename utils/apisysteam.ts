import { FilterQuery, Model } from 'mongoose';

class ApiFeatures<T extends Document> {
  private query: any;
  private queryStr: Record<string, any>;

  constructor(query: Model<T>, queryStr: Record<string, any>) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(): ApiFeatures<T> {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter(): ApiFeatures<T> {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage: number): ApiFeatures<T> {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }

  executeQuery(): Model<T> {
    return this.query;
  }
}

export default ApiFeatures;
