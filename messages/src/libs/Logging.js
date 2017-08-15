var moment = require('moment'),
    functions = require('libs/Functions');

class Logging
{
    constructor()
    {
        this.colors = {
            black   :'\u001b[1;30m',
            red     :'\u001b[1;31m',
            green   :'\u001b[1;32m',
            yellow  :'\u001b[1;33m',
            blue    :'\u001b[1;34m',
            purple  :'\u001B[1;35m',
            cyan    :'\u001B[1;36m',
            white   :'\u001B[1;37m',
        };

        this.backgrounds = {
            black   :'\u001b[1;40m',
            red     :'\u001b[1;41m',
            green   :'\u001b[1;42m',
            yellow  :'\u001b[1;43m',
            blue    :'\u001b[1;44m',
            purple  :'\u001B[1;45m',
            cyan    :'\u001B[1;46m',
            white   :'\u001B[1;47m',
        };

        this.formatting = {
            reset:      '\u001b[1;0m',
            space:      '   ',
            bold:       '\u001b[1;1m',
            italic:     '\u001b[1;3m',
            underline:  '\u001b[1;4m',
        };
    }

    /**
     * Echo something to the CLI
     *
     * @param string
     * @param params
     */
    echo(string, params)
    {
        // Parse {stuff}
        var data = (typeof string === 'string') ? string.match(/[^{}]+(?=\})/g) : false;
        if (data)
        {
            // Loop through to format it
            for (var i in data)
            {
                var value = data[i];

                if (value == '-')
                {
                    var newValue = this.formatting.space;
                }
                else
                {
                    var context = value.split(':');

                    // The context
                    var text = context[0];

                    // Real text
                    var realText = params[text];

                    // Get the color to use
                    var color = context[1] ? this.colors[context[1]] : this.colors['white'];

                    var style = '';
                    if (context[2] == 'bold') { style = this.formatting.bold; }
                    if (context[2] == 'italic') { style = this.formatting.italic; }
                    if (context[2] == 'underline') { style = this.formatting.underline; }

                    // Get new value
                    var newValue = color + style + realText + this.formatting.reset;
                }

                string = functions.replaceAll(string, '{' + value + '}', newValue);
            }
        }

        // print
        var date = moment().format('HH:mm:ss') +'  '+ moment().format('x').slice(-3);

        // print timestamp
        console.log('    [%s] %s', date, string);
    }

    /**
     * Echo a line to the CLI
     */
    line()
    {
        console.log('    ------------------------------------------------------------');
    }

    /**
     * Echo a space to the CLI
     */
    space()
    {
        this.echo('');
    }

    /**
     * Access console log
     */
    console()
    {
        console.log(arguments);
    }
}

// Export it
module.exports = new Logging();