# Ethereum Web Token

**Authentication for the blockchain era.**

Ethereum web tokens (EWTs) are [JSON web tokens](https://auth0.com/docs/jwt) that are signed using a Web3 provider. This enables authentication using an Ethereum address. Some use cases include:

- Permissioned ERC721 metadata
- Restricting API access to certain Ethereum addresses
- Proving ownership of an Ethereum address
- Basically anything auth related!

## Implementation

EWTs are just JWTs with a few additional constraints:

- The `alg` is set to ETH.
- An `address` field must be included in the payload.
- The signed payload is the [base64url](https://tools.ietf.org/html/rfc4648#section-5) encoding of `web3.sign(HEADER . payload)`

The EWT standard is intentionally simple to make it easy to integrate into existing JWT-based systems and libraries.

## Roadmap

The goal is to support all JWT features, especially [claims](https://tools.ietf.org/html/rfc7519#section-4). Pull requests are encouraged!

## License

MIT
