import type { z } from "zod";
import type {
  FieldValues,
  Resolver,
  ResolverError,
  ResolverSuccess,
} from "react-hook-form";

/**
 * Minimal zod <-> react-hook-form resolver.
 *
 * Avoids pulling in the extra `@hookform/resolvers` dependency for a single use
 * case. Maps a Zod schema's `safeParse` result onto the shape RHF expects.
 */
export function zodResolver<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      } as ResolverSuccess<z.infer<TSchema>>;
    }

    const fieldErrors: FieldValues = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") || "root";
      if (!fieldErrors[path]) {
        fieldErrors[path] = { type: issue.code, message: issue.message };
      }
    }

    return {
      values: {},
      errors: fieldErrors,
    } as ResolverError<z.infer<TSchema>>;
  };
}
