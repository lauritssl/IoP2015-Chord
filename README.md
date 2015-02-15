# Chord network implementation in node.js

To start a server with no other peers (initiate a Chord ring) run the following command:

```
node chord.js
```

To join an existing Chord ring, you need the address of an existing peer, then you are able to run:

```
node chord.js [IP-address] [port]
```

Access the web-interface on a node, by navigating to it from a web browser.

You can run the following commands in the terminal on an active node:

```
leave:       Perform nice leave
successor:   Return successor information
predecessor: Return predecessor information
exit:        Terminate node (brutal)
help:        Returns this information :)
```
