import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { EDIT_GAS_MODES } from '../../../../shared/constants/gas';
import { GasFeeContextProvider } from '../../../contexts/gasFee';
import {
  ERC1155,
  ERC20,
  ERC721,
  TRANSACTION_TYPES,
} from '../../../../shared/constants/transaction';
import { NETWORK_TO_NAME_MAP } from '../../../../shared/constants/network';
import { HEX_ZERO_VALUE } from '../../../../shared/constants/hex';

import { PageContainerFooter } from '../../ui/page-container';
import Dialog from '../../ui/dialog';
import Button from '../../ui/button';
import ActionableMessage from '../../ui/actionable-message/actionable-message';
import SenderToRecipient from '../../ui/sender-to-recipient';

import NicknamePopovers from '../modals/nickname-popovers';

import AdvancedGasFeePopover from '../advanced-gas-fee-popover';
import EditGasFeePopover from '../edit-gas-fee-popover/edit-gas-fee-popover';
import EditGasPopover from '../edit-gas-popover';
import ErrorMessage from '../../ui/error-message';
import { INSUFFICIENT_FUNDS_ERROR_KEY } from '../../../helpers/constants/error-keys';
import Typography from '../../ui/typography';
import { TYPOGRAPHY } from '../../../helpers/constants/design-system';

import NetworkAccountBalanceHeader from '../network-account-balance-header/network-account-balance-header';
import DepositPopover from '../deposit-popover/deposit-popover';
import EnableEIP1559V2Notice from './enableEIP1559V2-notice';
import {
  ConfirmPageContainerHeader,
  ConfirmPageContainerContent,
  ConfirmPageContainerNavigation,
} from '.';

export default class ConfirmPageContainer extends Component {
  state = {
    showNicknamePopovers: false,
    setShowDepositPopover: false,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    // Header
    action: PropTypes.string,
    hideSubtitle: PropTypes.bool,
    onEdit: PropTypes.func,
    showEdit: PropTypes.bool,
    subtitleComponent: PropTypes.node,
    title: PropTypes.string,
    image: PropTypes.string,
    titleComponent: PropTypes.node,
    hideSenderToRecipient: PropTypes.bool,
    showAccountInHeader: PropTypes.bool,
    accountBalance: PropTypes.string,
    assetStandard: PropTypes.string,
    // Sender to Recipient
    fromAddress: PropTypes.string,
    fromName: PropTypes.string,
    toAddress: PropTypes.string,
    toName: PropTypes.string,
    toMetadataName: PropTypes.string,
    toEns: PropTypes.string,
    toNickname: PropTypes.string,
    // Content
    contentComponent: PropTypes.node,
    errorKey: PropTypes.string,
    errorMessage: PropTypes.string,
    dataComponent: PropTypes.node,
    dataHexComponent: PropTypes.node,
    detailsComponent: PropTypes.node,
    ///: BEGIN:ONLY_INCLUDE_IN(flask)
    insightComponent: PropTypes.node,
    ///: END:ONLY_INCLUDE_IN
    tokenAddress: PropTypes.string,
    nonce: PropTypes.string,
    warning: PropTypes.string,
    unapprovedTxCount: PropTypes.number,
    origin: PropTypes.string.isRequired,
    ethGasPriceWarning: PropTypes.string,
    networkIdentifier: PropTypes.string,
    // Navigation
    totalTx: PropTypes.number,
    positionOfCurrentTx: PropTypes.number,
    nextTxId: PropTypes.string,
    prevTxId: PropTypes.string,
    showNavigation: PropTypes.bool,
    onNextTx: PropTypes.func,
    firstTx: PropTypes.string,
    lastTx: PropTypes.string,
    ofText: PropTypes.string,
    requestsWaitingText: PropTypes.string,
    // Footer
    onCancelAll: PropTypes.func,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    disabled: PropTypes.bool,
    editingGas: PropTypes.bool,
    handleCloseEditGas: PropTypes.func,
    // Gas Popover
    currentTransaction: PropTypes.object.isRequired,
    contact: PropTypes.object,
    isOwnedAccount: PropTypes.bool,
    supportsEIP1559V2: PropTypes.bool,
    nativeCurrency: PropTypes.string,
    isBuyableChain: PropTypes.bool,
    isApprovalOrRejection: PropTypes.bool,
  };

  render() {
    const {
      showEdit,
      onEdit,
      fromName,
      fromAddress,
      toName,
      toMetadataName,
      toEns,
      toNickname,
      toAddress,
      disabled,
      errorKey,
      errorMessage,
      contentComponent,
      action,
      title,
      image,
      titleComponent,
      subtitleComponent,
      hideSubtitle,
      detailsComponent,
      dataComponent,
      dataHexComponent,
      onCancelAll,
      onCancel,
      onSubmit,
      tokenAddress,
      nonce,
      unapprovedTxCount,
      warning,
      totalTx,
      positionOfCurrentTx,
      nextTxId,
      prevTxId,
      showNavigation,
      onNextTx,
      firstTx,
      lastTx,
      ofText,
      requestsWaitingText,
      hideSenderToRecipient,
      showAccountInHeader,
      origin,
      ethGasPriceWarning,
      editingGas,
      handleCloseEditGas,
      currentTransaction,
      contact = {},
      isOwnedAccount,
      supportsEIP1559V2,
      nativeCurrency,
      isBuyableChain,
      networkIdentifier,
      isApprovalOrRejection,
      ///: BEGIN:ONLY_INCLUDE_IN(flask)
      insightComponent,
      ///: END:ONLY_INCLUDE_IN
      accountBalance,
      assetStandard,
    } = this.props;

    const showAddToAddressDialog =
      !contact.name && toAddress && !isOwnedAccount && !hideSenderToRecipient;

    const shouldDisplayWarning =
      contentComponent && disabled && (errorKey || errorMessage);

    const hideTitle =
      (currentTransaction.type === TRANSACTION_TYPES.CONTRACT_INTERACTION ||
        currentTransaction.type === TRANSACTION_TYPES.DEPLOY_CONTRACT) &&
      currentTransaction.txParams?.value === HEX_ZERO_VALUE;

    const networkName =
      NETWORK_TO_NAME_MAP[currentTransaction.chainId] || networkIdentifier;

    const isSetApproveForAll =
      currentTransaction.type ===
      TRANSACTION_TYPES.TOKEN_METHOD_SET_APPROVAL_FOR_ALL;

    const { setShowDepositPopover } = this.state;

    const { t } = this.context;

    return (
      <GasFeeContextProvider transaction={currentTransaction}>
        <div className="page-container" data-testid="page-container">
          <ConfirmPageContainerNavigation
            totalTx={totalTx}
            positionOfCurrentTx={positionOfCurrentTx}
            nextTxId={nextTxId}
            prevTxId={prevTxId}
            showNavigation={showNavigation}
            onNextTx={(txId) => onNextTx(txId)}
            firstTx={firstTx}
            lastTx={lastTx}
            ofText={ofText}
            requestsWaitingText={requestsWaitingText}
          />
          {assetStandard === ERC20 ||
          assetStandard === ERC721 ||
          assetStandard === ERC1155 ? (
            <NetworkAccountBalanceHeader
              accountName={fromName}
              accountBalance={accountBalance}
              tokenName={nativeCurrency}
              accountAddress={fromAddress}
              networkName={networkName}
              chainId={currentTransaction.chainId}
            />
          ) : (
            <ConfirmPageContainerHeader
              showEdit={showEdit}
              onEdit={() => onEdit()}
              showAccountInHeader={showAccountInHeader}
              accountAddress={fromAddress}
            >
              {hideSenderToRecipient ? null : (
                <SenderToRecipient
                  senderName={fromName}
                  senderAddress={fromAddress}
                  recipientName={toName}
                  recipientMetadataName={toMetadataName}
                  recipientAddress={toAddress}
                  recipientEns={toEns}
                  recipientNickname={toNickname}
                />
              )}
            </ConfirmPageContainerHeader>
          )}
          <div>
            {showAddToAddressDialog && (
              <>
                <Dialog
                  type="message"
                  className="send__dialog"
                  onClick={() => this.setState({ showNicknamePopovers: true })}
                >
                  {t('newAccountDetectedDialogMessage')}
                </Dialog>
                {this.state.showNicknamePopovers ? (
                  <NicknamePopovers
                    onClose={() =>
                      this.setState({ showNicknamePopovers: false })
                    }
                    address={toAddress}
                  />
                ) : null}
              </>
            )}
          </div>
          <EnableEIP1559V2Notice isFirstAlert={!showAddToAddressDialog} />
          {contentComponent || (
            <ConfirmPageContainerContent
              action={action}
              title={title}
              image={image}
              titleComponent={titleComponent}
              subtitleComponent={subtitleComponent}
              hideSubtitle={hideSubtitle}
              detailsComponent={detailsComponent}
              dataComponent={dataComponent}
              dataHexComponent={dataHexComponent}
              ///: BEGIN:ONLY_INCLUDE_IN(flask)
              insightComponent={insightComponent}
              ///: END:ONLY_INCLUDE_IN
              errorMessage={errorMessage}
              errorKey={errorKey}
              tokenAddress={tokenAddress}
              nonce={nonce}
              warning={warning}
              onCancelAll={onCancelAll}
              onCancel={onCancel}
              cancelText={t('reject')}
              onSubmit={onSubmit}
              submitText={t('confirm')}
              disabled={disabled}
              unapprovedTxCount={unapprovedTxCount}
              rejectNText={t('rejectTxsN', [unapprovedTxCount])}
              origin={origin}
              ethGasPriceWarning={ethGasPriceWarning}
              hideTitle={hideTitle}
              supportsEIP1559V2={supportsEIP1559V2}
              hasTopBorder={showAddToAddressDialog}
              currentTransaction={currentTransaction}
              nativeCurrency={nativeCurrency}
              networkName={networkName}
              toAddress={toAddress}
              transactionType={currentTransaction.type}
              isBuyableChain={isBuyableChain}
            />
          )}
          {shouldDisplayWarning && errorKey === INSUFFICIENT_FUNDS_ERROR_KEY && (
            <div className="confirm-approve-content__warning">
              <ActionableMessage
                message={
                  isBuyableChain ? (
                    <Typography variant={TYPOGRAPHY.H7} align="left">
                      {t('insufficientCurrencyBuyOrDeposit', [
                        nativeCurrency,
                        networkName,
                        <Button
                          type="inline"
                          className="confirm-page-container-content__link"
                          onClick={() =>
                            this.setState({ setShowDepositPopover: true })
                          }
                          key={`${nativeCurrency}-buy-button`}
                        >
                          {t('buyAsset', [nativeCurrency])}
                        </Button>,
                      ])}
                    </Typography>
                  ) : (
                    <Typography variant={TYPOGRAPHY.H7} align="left">
                      {t('insufficientCurrencyDeposit', [
                        nativeCurrency,
                        networkName,
                      ])}
                    </Typography>
                  )
                }
                useIcon
                iconFillColor="var(--color-error-default)"
                type="danger"
              />
            </div>
          )}
          {setShowDepositPopover && (
            <DepositPopover
              onClose={() => this.setState({ setShowDepositPopover: false })}
            />
          )}
          {shouldDisplayWarning && errorKey !== INSUFFICIENT_FUNDS_ERROR_KEY && (
            <div className="confirm-approve-content__warning">
              <ErrorMessage errorKey={errorKey} />
            </div>
          )}
          {isSetApproveForAll && isApprovalOrRejection && (
            <Dialog type="error" className="confirm-page-container__dialog">
              {/*
                TODO: https://github.com/MetaMask/metamask-extension/issues/15745
                style={{ fontWeight: 'bold' }} because reset.scss removes font-weight from b. We should fix this.
              */}
              {t('confirmPageDialogSetApprovalForAll', [
                <b
                  key="confirm-page-container__dialog-placeholder-1"
                  style={{ fontWeight: 'bold' }}
                >
                  {t('confirmPageDialogSetApprovalForAllPlaceholder1')}
                </b>,
                <b
                  key="confirm-page-container__dialog-placeholder-2"
                  style={{ fontWeight: 'bold' }}
                >
                  {t('confirmPageDialogSetApprovalForAllPlaceholder2')}
                </b>,
              ])}
            </Dialog>
          )}
          {contentComponent && (
            <PageContainerFooter
              onCancel={onCancel}
              cancelText={t('reject')}
              onSubmit={onSubmit}
              submitText={t('confirm')}
              submitButtonType={
                isSetApproveForAll ? 'danger-primary' : 'primary'
              }
              disabled={disabled}
            >
              {unapprovedTxCount > 1 && (
                <a onClick={onCancelAll}>
                  {t('rejectTxsN', [unapprovedTxCount])}
                </a>
              )}
            </PageContainerFooter>
          )}
          {editingGas && !supportsEIP1559V2 && (
            <EditGasPopover
              mode={EDIT_GAS_MODES.MODIFY_IN_PLACE}
              onClose={handleCloseEditGas}
              transaction={currentTransaction}
            />
          )}
          {supportsEIP1559V2 && (
            <>
              <EditGasFeePopover />
              <AdvancedGasFeePopover />
            </>
          )}
        </div>
      </GasFeeContextProvider>
    );
  }
}
