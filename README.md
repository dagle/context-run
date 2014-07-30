context-run
===========

Create easy runnable commands from the firefox context-menu.
I created this to be able to run shell commands from firefox, but it's
not limited to just do that. To use this you need the firefox sdk
(https://developer.mozilla.org/en-US/Add-ons/SDK) installed, since I couldn't
be bothered with creating a ui and editing the source isn't that bad of an idea.

Edit the source in lib/main.js to add the bindings you want. There are 2 kinds of
context atm, links and select and 2 kinds of input methods, item and panel. A link
context is when you right click a link and a select context is when you select text and
right click the text. An item input method is just the text from the context, hence you
can't edit it. An input panel is different in that it allows you to change and add args
from the context.

For examples, look in lib/main.js.
