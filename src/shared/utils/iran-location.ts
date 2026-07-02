import countiesJson from "@/shared/data/counties.json";
import provincesJson from "@/shared/data/provinces.json";

const PROVINCE_STRIDE = 2;
const COUNTY_STRIDE = 3;

export type IranLocationOption = {
  value: number;
  label: string;
};

export type MantineLocationOption = {
  value: string;
  label: string;
};

const EMPTY_LOCATION_OPTIONS: IranLocationOption[] = [];
const EMPTY_MANTINE_LOCATION_OPTIONS: MantineLocationOption[] = [];

function readPositiveInteger(value: unknown, context: string) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${context} must be a positive safe integer.`);
  }

  return value;
}

function readNonEmptyString(value: unknown, context: string) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${context} must be a non-empty string.`);
  }

  return value;
}

function buildProvinceOptions(data: readonly unknown[]) {
  if (data.length % PROVINCE_STRIDE !== 0) {
    throw new Error("provinces.json has an invalid flat-array length.");
  }

  const options: IranLocationOption[] = [];

  for (let offset = 0; offset < data.length; offset += PROVINCE_STRIDE) {
    const expectedId = offset / PROVINCE_STRIDE + 1;
    const id = readPositiveInteger(data[offset], `Province ID at offset ${offset}`);
    const name = readNonEmptyString(data[offset + 1], `Province name at offset ${offset + 1}`);

    if (id !== expectedId) {
      throw new Error(`Province IDs must be dense and ordered. Expected ${expectedId}, received ${id}.`);
    }

    options.push({
      value: id,
      label: name,
    });
  }

  return options;
}

function buildCountyOptionsByProvinceId(data: readonly unknown[], provinceCount: number) {
  if (data.length % COUNTY_STRIDE !== 0) {
    throw new Error("counties.json has an invalid flat-array length.");
  }

  const optionsByProvinceId: IranLocationOption[][] = Array.from({ length: provinceCount + 1 }, () => []);

  for (let offset = 0; offset < data.length; offset += COUNTY_STRIDE) {
    const expectedId = offset / COUNTY_STRIDE + 1;
    const id = readPositiveInteger(data[offset], `County ID at offset ${offset}`);
    const name = readNonEmptyString(data[offset + 1], `County name at offset ${offset + 1}`);
    const provinceId = readPositiveInteger(data[offset + 2], `County province ID at offset ${offset + 2}`);

    if (id !== expectedId) {
      throw new Error(`County IDs must be dense and ordered. Expected ${expectedId}, received ${id}.`);
    }

    const provinceOptions = optionsByProvinceId[provinceId];

    if (!provinceOptions) {
      throw new Error(`County ${id} references unknown province ID ${provinceId}.`);
    }

    provinceOptions.push({
      value: id,
      label: name,
    });
  }

  return optionsByProvinceId;
}

function toMantineOptions(options: readonly IranLocationOption[]) {
  return options.map((option) => ({ value: String(option.value), label: option.label }));
}

function buildOptionLookup(options: readonly IranLocationOption[]) {
  return new Map(options.map((option) => [String(option.value), option.label]));
}

export const provinceOptions = buildProvinceOptions(provincesJson);

export const countyOptionsByProvinceId = buildCountyOptionsByProvinceId(countiesJson, provinceOptions.length);

export const mantineProvinceOptions = toMantineOptions(provinceOptions);

const provinceNameById = buildOptionLookup(provinceOptions);
const countyNameById = new Map<string, string>();
const countyLocationByNormalizedName = new Map<string, { countyId: string; provinceId: string }>();
const mantineCountyOptionsByProvinceId = countyOptionsByProvinceId.map((options, provinceId) => {
  options.forEach((option) => {
    const countyId = String(option.value);

    countyNameById.set(countyId, option.label);
    countyLocationByNormalizedName.set(normalizeLocationName(option.label), {
      countyId,
      provinceId: String(provinceId),
    });
  });

  return toMantineOptions(options);
});

function normalizeLocationName(value: string) {
  return value
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

export function getCountyOptions(provinceId: number | null) {
  if (provinceId === null) {
    return EMPTY_LOCATION_OPTIONS;
  }

  return countyOptionsByProvinceId[provinceId] ?? EMPTY_LOCATION_OPTIONS;
}

export function getMantineCountyOptions(provinceId: string) {
  if (!provinceId) {
    return EMPTY_MANTINE_LOCATION_OPTIONS;
  }

  return mantineCountyOptionsByProvinceId[Number(provinceId)] ?? EMPTY_MANTINE_LOCATION_OPTIONS;
}

export function getProvinceName(provinceId: string) {
  return provinceNameById.get(provinceId) ?? "";
}

export function getCountyName(countyId: string) {
  return countyNameById.get(countyId) ?? "";
}

export function findCountyByName(countyName: string) {
  return countyLocationByNormalizedName.get(normalizeLocationName(countyName));
}
