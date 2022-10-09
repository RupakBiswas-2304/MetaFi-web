import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function Header() {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) {return}
        if (typeof(window)!== "undefined") {
            console.log("Hwloe")
            if (window.localStorage.getItem("connected")) {
                console.log("world");
                enableWeb3()
            }
        }
    }, [])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log("Account Changed")
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, )

    return (<div>
        <h1>BuyMeACoffee</h1>
        {account ? (<div>Connected to {account} </div>) : <button onClick={async () => { await enableWeb3(); window.localStorage.setItem = ("connected", "injected") }} disabled={isWeb3EnableLoading}>Connect Wallet</button>}
    </div>)
}
