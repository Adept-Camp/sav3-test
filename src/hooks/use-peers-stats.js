import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import ipUtils from 'src/lib/utils/ip'

// TODO: convert to useInterval

const usePeersStats = () => {
  const [peersStats, setPeersStats] = useState([])
  const [pollCount, setPollCount] = useState(0)

  const pollTime = 5000 // if too fast will break the peer posts demo
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const interval = setInterval(() => {
      setPollCount(pollCount + 1)
    }, pollTime)

    // return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    ;(async () => {
      const peersStats = await sav3Ipfs.getPeersStats()
      for (const peersStat of peersStats) {
        if (!peersStat.ip) {
          continue
        }
        let isoCountryCode
        try {
          isoCountryCode = await ipUtils.getIsoCountryCodeFromIpCached(peersStat.ip)
        }
        catch (e) {
          console.error(e)
          continue
        }
        const countryFlagEmoji = ipUtils.isoCountryCodeToCountryFlagEmoji(isoCountryCode)

        peersStat.isoCountryCode = isoCountryCode
        peersStat.countryFlagEmoji = countryFlagEmoji
      }
      setPeersStats(peersStats)
    })()
  }, [pollCount])

  return peersStats
}

export default usePeersStats
