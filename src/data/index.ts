import { establishments } from "./establishments";
import { partnerBenefits } from "./partners";

export const getAllEstablishments = () => establishments;

export const getFoodEstablishments = () =>
  establishments.filter((establishment) => establishment.category === "alimentacao");

export const getEstablishmentBySlug = (slug: string) =>
  establishments.find((establishment) => establishment.slug === slug);

export const getPartnerBenefit = (slug: string) =>
  partnerBenefits.find(
    (benefit) => benefit.establishmentSlug === slug && benefit.isActive,
  );

export const getPartnerEstablishments = () =>
  partnerBenefits
    .filter((benefit) => benefit.isActive)
    .map((benefit) => ({
      benefit,
      establishment: getEstablishmentBySlug(benefit.establishmentSlug),
    }))
    .filter(
      (entry): entry is { benefit: (typeof partnerBenefits)[number]; establishment: NonNullable<ReturnType<typeof getEstablishmentBySlug>> } =>
        Boolean(entry.establishment),
    );

export { establishments, partnerBenefits };
export * from "./types";
