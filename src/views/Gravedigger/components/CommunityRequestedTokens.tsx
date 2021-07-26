import React,{useEffect,useState} from 'react'
import { Heading,Text,Card } from "@rug-zombie-libs/uikit"
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import useToast from 'hooks/useToast'

const Container = styled(Card)`
  box-shadow: rgb(204 246 108) 0px 0px 20px;
`
const CommunityRequestedTokens:React.FC = () => {
    const [responses,setResponses] = useState([])
    const {toastError} = useToast()
    useEffect(() => {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${process.env.TYPEFORM_TOKEN}`)
        const requestOptions = {
            method: 'GET',
            headers
        }
        fetch('https://api.typeform.com/forms/LKwVHkPz/responses',requestOptions).then(async (response:any) => {
            const r = await response.json()
            setResponses(r.items)
        }).catch(error => {
            toastError('Failed to fetch form responses')
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const {t} = useTranslation()
    return (
        <Container>
        <Heading>
                <Text fontSize="60px" textAlign="center">
                    {t('Community Requested Tokens')}
                </Text>
                <Text textAlign="center" color="red">
                    {t('community requests are reviewed by our team and do not imply the named projects were scams')}
                </Text>
        </Heading>
        {
            responses.map((resp) => {
                return(
                    <Text fontSize="30px" color="green" textAlign="center" py="10px">
                        {resp.answers[1].text}
                    </Text>
                )
            })
        }
        </Container>
    )
}

export default CommunityRequestedTokens