# Galaxy Tool Popularity

Galaxy Tool Popularity is a Galaxy add-on that supplies popularity of
tools to use on a given dataset. The popularity calculation is determined on two
most recent tools used to generate the chosen dataset and it is based on the
usage of Galaxy server available at [usegalaxy.org](https://usegalaxy.org) from
2005 until 2015.

To install this add-on, clone this repository into
`$GALAXY_HOME/config/plugins/visualization/popularity` with

    cd $GALAXY_HOME/config/plugins/visualization
    git clone https://github.com/galaxyguardians/galaxy-tool-popularity.git popularity

Then restart the Galaxy server process and the add-on will become available
under `Vizualization` icon for every dataset in a history.
