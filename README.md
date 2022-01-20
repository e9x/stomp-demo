Used to serve https://github.com/waterswat/toomanyproxies

The `toomanyproxies` repository needs to be in the outside directory. If you are deploying this, your structure will look like:

```
Root
│
└───toomanyproxies
│   │   .git
│   │   ...
│   │
│   └───Server
│       │   index.mjs
│       │   ...
│   
└───toomanyproxies-frontend
│   │   .git
│   │   ServerInstance.mjs
│   │   ...
│   
```
