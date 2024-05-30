export type ICampaignBanner<T = object> = React.FC<T> & {
  stripeImage: string
  stripeImageWidth: number | string
  stripeImageAlt: string
  background?: string
}
