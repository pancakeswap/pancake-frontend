import { Box, Message } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'

export function ProfileRequirementWarning({
  profileRequirement,
}: {
  profileRequirement: DeserializedPool['profileRequirement']
}) {
  // const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)
  return (
    <Message variant="warning">
      <Box>
          <></>
        {/* <MessageText>
          {notMeetRequired &&
            notMeetThreshold &&
            t('This pool requires active Pancake Profile and %amount% profile points.', {
              amount: profileRequirement.thresholdPoints.toNumber().toLocaleString(),
            })}
          {notMeetRequired && !notMeetThreshold && t('This pool requires active Pancake Profile')}
          {!notMeetRequired &&
            notMeetThreshold &&
            t('This pool requires %amount% profile points.', {
              amount: profileRequirement.thresholdPoints.toNumber().toLocaleString(),
            })}
        </MessageText>
        {(notMeetRequired || notMeetThreshold) && (
          <MessageText bold>
            {notMeetRequired ? (
              <NextLinkFromReactRouter style={{ textDecoration: 'underline' }} to="/create-profile">
                {t('Create Profile')} »
              </NextLinkFromReactRouter>
            ) : (
              <NextLinkFromReactRouter style={{ textDecoration: 'underline' }} to="/profile">
                {t('Go to Profile')} »
              </NextLinkFromReactRouter>
            )}
          </MessageText>
        )} */}
      </Box>
    </Message>
  )
}
