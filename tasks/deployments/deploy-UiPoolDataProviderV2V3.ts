import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { deployUiPoolDataProviderV2V3 } from '../../helpers/contracts-deployments';
import { chainlinkAggregatorProxy, chainlinkEthUsdAggregatorProxy } from '../../helpers/constants';
import { getFirstSigner, getLendingPoolAddressesProvider } from '../../helpers/contracts-getters';
import { LendingPoolAddressesProviderFactory } from '../../types';
import { DRE, getDb } from '../../helpers/misc-utils';

task(`deploy-${eContractid.UiPoolDataProviderV2V3}`, `Deploys the UiPoolDataProviderV2V3 contract`)
  .addFlag('verify', 'Verify UiPoolDataProviderV2V3 contract via Etherscan API.')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    const network = process.env.FORK ? process.env.FORK : localBRE.network.name;

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(
      `\n- UiPoolDataProviderV2V3 price aggregator: ${chainlinkAggregatorProxy[network]}`
    );
    console.log(
      `\n- UiPoolDataProviderV2V3 eth/usd price aggregator: ${chainlinkAggregatorProxy[network]}`
    );
    console.log(`\n- UiPoolDataProviderV2V3 deployment`);

    const UiPoolDataProviderV2V3 = await deployUiPoolDataProviderV2V3(
      chainlinkAggregatorProxy[network],
      chainlinkEthUsdAggregatorProxy[network],
      verify
    );

    //
    // // connect to the deployed UiPoolDataProviderV2V3 contract
    // const UiPoolDataProviderV2V3Contract = await localBRE.ethers.getContractFactory(
    //   eContractid.UiPoolDataProviderV2V3
    // );
    // const uiPoolDataProviderV2V3 = await UiPoolDataProviderV2V3Contract.attach(
    //   UiPoolDataProviderV2V3.address
    // );
    //

    // const lendingPoolAddressesProvider = await getLendingPoolAddressesProvider();
    // // attach to the LendingPoolAddressesProvider contract
    //
    // const lendingPool = await lendingPoolAddressesProvider.getLendingPool();
    //
    // const list1 = lendingPoolAddressesProvider.getReservesList();
    // console.log('LendingPoolAddressesProvider.getReservesList() result:', list1);
    console.log('UiPoolDataProviderV2V3 deployed at:', UiPoolDataProviderV2V3.address);

    const list2 = await UiPoolDataProviderV2V3.getReservesList(
      '0xA85847c2A1d8143A878afac8D7FF7E8aFAF92e4c'
    );
    console.log('UiPoolDataProviderV2V3.getReservesList() result:', list2);

    const data = await UiPoolDataProviderV2V3.getReservesData(
      '0xA85847c2A1d8143A878afac8D7FF7E8aFAF92e4c'
    );
    // console.log('UiPoolDataProviderV2V3.getReserveData() result:', data);
    console.log('UiPoolDataProviderV2V3 deployed at:', UiPoolDataProviderV2V3.address);
  });
