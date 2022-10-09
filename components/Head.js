import { ConnectButton } from "web3uikit";


export default function Headerr() {
    return (
        <div id="connectButton">
            <ConnectButton moralisAuth={false} />
        </div>
    )
}