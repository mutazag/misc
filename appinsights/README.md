## Configuration


### using config

appinsights.cfg file as follows:


```json
appinsights: {
    key: '<<<guid>>>',
    connection_string: 'InstrumentationKey<<<guid>>>;IngestionEndpoint=https://<<<endpoint>>>'
}
```


### using configParser

appinsights.ini file as follows:

```ini
[appinsights]
key = <<<guid>>>
connection_string = InstrumentationKey=<<<guid>>>;IngestionEndpoint=https://<<<endpoint>>>
```