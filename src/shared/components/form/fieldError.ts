function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (Array.isArray(error)) {
    return getFirstFieldError(error);
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return undefined;
}

export function getFirstFieldError(errors: readonly unknown[]) {
  for (const error of errors) {
    const message = getErrorMessage(error);

    if (message) {
      return message;
    }
  }

  return undefined;
}
