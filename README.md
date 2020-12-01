# Colour Adjacencies
Reads an image and outputs the colour adjacencies in a TSV format.
Primary objective is to help me learn basic web development. 
Intended to be used in a web browser locally, without sending any data to a server.

This project declares conformity to [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).

"Colour" and "color" will be used interchangeably and arbitrarily in both the code
and documentation.

This project is still in development.

Long term objective is to port this as an Excel Add-In.

# About this Github repository

*   I made this Github repository public so I could share with my twitter friends.
*   It may be made private in the future.


# How to run

1. Clone the git repository
1. Open `index.html` in your favourite web browser

This project is being developed with Visual Studio Code and tested with mostly
Microsoft Edge for Linux and sometimes Google Chrome. I don't know how this choice
of tools can affect development and compatibility.


# API

## Input 
*   Source image file
*   Options
    * Don't relate diagonals
        * For each pixel, only consider as adjacent the four (4) neighbours with
        a common edge. (top, bottom, left, and right neighbours)
        * By default, all 8 neighbours are considered adjacent.
    * Always include alpha column in output
        * If the image doesn't have an alpha component, one will be added at
        full opacity in the output.
        * By default, images without an alpha component won't get the
        alpha columns in the output.

### Command Line Interface

None, because my primary objective is to learn JavaScript, so I don't want
to use Node.js for this first implementation.


## Output
*   Tab-separated values.
*   For images **with** an alpha channel, data will be formatted like this:

    |r  |g  |b  |a  |adj_r|adj_g|adj_b|adj_a|
    |---|---|---|---|-----|-----|-----|-----|
    |0  |32 |64 |128|0    |0    |0    |255  |
    |0  |32 |64 |255|0    |0    |0    |255  |
    |0  |32 |64 |255|0    |32   |0    |255  |
    |0  |64 |0  |255|0    |0    |0    |255  |

*   By default, for images **without** an alpha channel, the alpha columns will be absent.

    |r  |g  |b  |adj_r|adj_g|adj_b|
    |---|---|---|-----|-----|-----|
    |0  |32 |64 |0    |0    |0    |
    |0  |32 |64 |0    |32   |0    |
    |0  |64 |0  |0    |0    |0    |

*   If `Always include alpha column in output` was specified, images **without** an alpha channel
will get an alpha column at full opacity.

    |r  |g  |b  |a  |adj_r|adj_g|adj_b|adj_a|
    |---|---|---|---|-----|-----|-----|-----|
    |0  |32 |64 |255|0    |0    |0    |255  |
    |0  |32 |64 |255|0    |32   |0    |255  |
    |0  |64 |0  |255|0    |0    |0    |255  |


*   The rows will be sorted in ascending order.

    |r  |g  |b  |adj_r|adj_g|adj_b|
    |---|---|---|-----|-----|-----|
    |0  |32 |64 |0    |0    |0    |
    |0  |32 |64 |0    |32   |0    |
    |0  |64 |0  |0    |0    |0    |

*   Symmetric relations will be included;
if A is adjacent to B, then B is adjacent to A, 
so this single relation will generate two rows.

    |r  |g  |b  |adj_r|adj_g|adj_b|
    |---|---|---|-----|-----|-----|
    |0  |0  |0  |0    |64   |0    |
    |0  |64 |0  |0    |0    |0    |

*   Reflexive relations will *not* be included;
a color cannot be adjacent with itself.

*   Columns will be sorted in this order:
    - Red
    - Green
    - Blue
    - Alpha (if applicable)
    - Adjacent Red
    - Adjacent Green
    - Adjacent Blue
    - Adjacent Alpha (if applicable)

*   The first row will contain the column names.
*   The column names will be:

    |Column Name|Color Channel  | Note           |
    |-----------|---------------|----------------|
    | `r`       |Red            |
    | `g`       |Green          |
    | `b`       |Blue           |
    | `a`       |Alpha          |(if applicable) |
    | `adj_r`   |Adjacent Red   |
    | `adj_g`   |Adjacent Green |
    | `adj_b`   |Adjacent Blue  |
    | `adj_a`   |Adjacent Alpha |(if applicable) |

*   The line-endings may be either in Windows (CRLF) or Unix (LF) style.