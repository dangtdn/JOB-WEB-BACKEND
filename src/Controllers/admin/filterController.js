import {
  createFilterService,
  getFiltersService,
} from "../../services/admin/filterService.js";

// create a filter handller
export async function createFilter(req, res, next) {
  try {
    const filter = await createFilterService(req.body);
    return res.status(201).json(filter);
  } catch (error) {
    next(error);
  }
}
// find all filters handller
export async function getFilters(req, res, next) {
  try {
    const filters = await getFiltersService();
    return res.status(201).json(filters);
  } catch (error) {
    next(error);
  }
}
