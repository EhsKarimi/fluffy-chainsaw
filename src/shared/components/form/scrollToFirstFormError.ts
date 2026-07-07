const focusableSelector = 'input, textarea, select, button, [role="combobox"], [tabindex]:not([tabindex="-1"])';

const errorTargetSelectors = [
  '[data-atis-field-error="true"]',
  '[aria-invalid="true"]',
  '[data-invalid="true"]',
  ".mantine-InputWrapper-root:has(.mantine-InputWrapper-error) input",
  ".mantine-InputWrapper-root:has(.mantine-InputWrapper-error) textarea",
  '.mantine-InputWrapper-root:has(.mantine-InputWrapper-error) [role="combobox"]',
  ".border-red-600",
] as const;

function findFirstErrorTarget(formElement: HTMLFormElement): HTMLElement | null {
  for (const selector of errorTargetSelectors) {
    try {
      const target = formElement.querySelector<HTMLElement>(selector);

      if (target) {
        return target;
      }
    } catch {
      // Some older browsers may not support advanced selectors like :has().
      // Keep trying the simpler selectors instead of breaking form submission.
    }
  }

  return null;
}

function getFocusableElement(target: HTMLElement): HTMLElement {
  if (target.matches(focusableSelector)) {
    return target;
  }

  return target.querySelector<HTMLElement>(focusableSelector) ?? target;
}

export function requestScrollToFirstFormError(formElement: HTMLFormElement) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = findFirstErrorTarget(formElement);

      if (!target) {
        return;
      }

      const focusTarget = getFocusableElement(target);

      focusTarget.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      focusTarget.focus({ preventScroll: true });
    });
  });
}
