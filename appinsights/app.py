
import config

cfg = config.Config('appinsights/appinsights.cfg')

print(cfg['appinsights'])

appinsights_key = cfg['appinsights.key']
appinsights_connectionstring = cfg['appinsights.connection_string']


import configparser
cfg2 = configparser.ConfigParser()
cfg2.read('appinsights/appinsights.ini')

print(cfg2['appinsights'])
print(cfg2['appinsights']['key'])
print(cfg2['appinsights']['connection_string'])




import logging
from opencensus.ext.azure.log_exporter import AzureLogHandler


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)



logger.addHandler(AzureLogHandler(connection_string=cfg2['appinsights']['connection_string']))
properties = {'custom_dimensions': {'key_1': 'value_1', 'key_2': 'value_2'}}


logger.info('hello there', extra=properties)

print('THE END!')




# Use properties in exception logs
try:
    result = 1 / 0  # generate a ZeroDivisionError
except Exception:
    logger.exception('Captured an exception.', extra=properties)


print('THE END!')


logger.debug('debug msg', extra=properties)
logger.error('error msg', extra=properties)
logger.critical('critical msg', extra=properties)