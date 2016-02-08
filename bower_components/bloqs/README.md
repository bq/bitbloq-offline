[![Stories in Ready](https://badge.waffle.io/bq/bloqs.png?label=ready&title=Ready)](https://waffle.io/bq/bloqs)
# bloqs

Bloqs lib to develop awesome tools to teach robotics

## About

A JavaScript library by Bitbloq Team

See the [project homepage](https://github.com/bq/bloqs).

## Installation

Using Bower (dev branch its the completed right now):

    bower install bloqs#dev

Or grab the [source](https://github.com/bq/bloqs/dist/bloqs.js) ([minified](https://github.com/bq/bloqs/dist/bloqs.min.js)).

## Usage

Basic usage is as follows:

    
        var bloq1 = new bloqs.Bloq({
            bloqData: bloqSchemas['if'],
            componentsArray: componentsArray,
            $field: $field
        });
    
        $field.append(bloq1.$bloq);
    
        bloq1.enable(true);
    
        bloq1.doConnectable();

See the examples folder, first the simple web example, next how to load, save or change language.

## Bloqs Documentation

Start with `docs/index.html`.

## Contributing

We'll check out your contribution if you:

* Have a clear and documented rationale for your changes.
* Package these up in a pull request.

We'll do our best to help you out with any contribution issues you may have.

## License

MIT. See `LICENSE.txt` in this directory.
