import axios from 'axios'
import salesforceConfig from '../config/salesforce.config.js'
import { getAccessToken } from './salesforceAuth.js'
import {
  memberProfile,
  memberClaims,
  memberEOB,
  memberBenefits,
  memberPharmacy,
  memberReferrals,
  memberProviders,
  memberOutOfPocket,
  memberDashboardStats,
} from '../data/mockMemberData.js'
import {
  providerProfile,
  providerPatients,
  providerClaims,
  providerPayments,
  providerDashboardStats,
} from '../data/mockProviderData.js'

const USE_MOCK = salesforceConfig.USE_MOCK_DATA

// Helper to simulate network delay in mock mode
const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

// Helper for real Salesforce API calls
async function sfGet(path) {
  const { access_token, instance_url } = await getAccessToken()
  const response = await axios.get(`${instance_url}${salesforceConfig.API_BASE_PATH}${path}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  return response.data
}

async function sfQuery(soql) {
  const { access_token, instance_url } = await getAccessToken()
  const response = await axios.get(
    `${instance_url}${salesforceConfig.QUERY_PATH}?q=${encodeURIComponent(soql)}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  return response.data.records
}

// ─── Member API ──────────────────────────────────────────────────────────────

export async function getMemberProfile(memberId) {
  if (USE_MOCK) return mockDelay(memberProfile)
  const records = await sfQuery(
    `SELECT Id, Name, HealthCloudGA__MemberId__c, Birthdate, Email, Phone, MailingStreet, MailingCity, MailingState, MailingPostalCode FROM Contact WHERE HealthCloudGA__MemberId__c = '${memberId}' LIMIT 1`
  )
  return records[0]
}

export async function getMemberClaims(memberId) {
  if (USE_MOCK) return mockDelay(memberClaims)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__ClaimId__c, HealthCloudGA__ClaimDate__c, HealthCloudGA__Provider__c, HealthCloudGA__ClaimType__c, HealthCloudGA__BilledAmount__c, HealthCloudGA__AllowedAmount__c, HealthCloudGA__PaidAmount__c, HealthCloudGA__ClaimStatus__c FROM HealthCloudGA__Claim__c WHERE HealthCloudGA__MemberId__c = '${memberId}' ORDER BY HealthCloudGA__ClaimDate__c DESC`
  )
}

export async function getMemberEOB(memberId) {
  if (USE_MOCK) return mockDelay(memberEOB)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__EOBId__c, HealthCloudGA__ProcessedDate__c, HealthCloudGA__BilledAmount__c, HealthCloudGA__AllowedAmount__c, HealthCloudGA__PaidAmount__c, HealthCloudGA__MemberResponsibility__c FROM HealthCloudGA__EOB__c WHERE HealthCloudGA__MemberId__c = '${memberId}' ORDER BY HealthCloudGA__ProcessedDate__c DESC`
  )
}

export async function getMemberBenefits(memberId) {
  if (USE_MOCK) return mockDelay(memberBenefits)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__BenefitType__c, HealthCloudGA__CoverageDetails__c FROM HealthCloudGA__Benefit__c WHERE HealthCloudGA__MemberId__c = '${memberId}'`
  )
}

export async function getMemberPharmacy(memberId) {
  if (USE_MOCK) return mockDelay(memberPharmacy)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__DrugName__c, HealthCloudGA__Dosage__c, HealthCloudGA__Quantity__c, HealthCloudGA__RefillsRemaining__c, HealthCloudGA__LastFilled__c, HealthCloudGA__Pharmacy__c FROM HealthCloudGA__Prescription__c WHERE HealthCloudGA__MemberId__c = '${memberId}' ORDER BY HealthCloudGA__LastFilled__c DESC`
  )
}

export async function getMemberReferrals(memberId) {
  if (USE_MOCK) return mockDelay(memberReferrals)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__AuthNumber__c, HealthCloudGA__Specialist__c, HealthCloudGA__ReferralDate__c, HealthCloudGA__Status__c FROM HealthCloudGA__Referral__c WHERE HealthCloudGA__MemberId__c = '${memberId}' ORDER BY HealthCloudGA__ReferralDate__c DESC`
  )
}

export async function getMemberProviders(memberId) {
  if (USE_MOCK) return mockDelay(memberProviders)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__NPI__c, HealthCloudGA__Specialty__c, Phone, Email, MailingStreet, MailingCity FROM Account WHERE Id IN (SELECT HealthCloudGA__ProviderId__c FROM HealthCloudGA__MemberProvider__c WHERE HealthCloudGA__MemberId__c = '${memberId}')`
  )
}

export async function getMemberOutOfPocket(memberId) {
  if (USE_MOCK) return mockDelay(memberOutOfPocket)
  return sfQuery(
    `SELECT Id, HealthCloudGA__DeductibleMet__c, HealthCloudGA__DeductibleMax__c, HealthCloudGA__OOPMet__c, HealthCloudGA__OOPMax__c FROM HealthCloudGA__Accumulator__c WHERE HealthCloudGA__MemberId__c = '${memberId}' AND HealthCloudGA__PlanYear__c = '2024' LIMIT 1`
  )
}

export async function getMemberDashboardStats(memberId) {
  if (USE_MOCK) return mockDelay(memberDashboardStats)
  // Aggregate multiple queries for dashboard
  const [claims, prescriptions, referrals] = await Promise.all([
    sfQuery(`SELECT COUNT(Id) cnt FROM HealthCloudGA__Claim__c WHERE HealthCloudGA__MemberId__c = '${memberId}'`),
    sfQuery(`SELECT COUNT(Id) cnt FROM HealthCloudGA__Prescription__c WHERE HealthCloudGA__MemberId__c = '${memberId}'`),
    sfQuery(`SELECT COUNT(Id) cnt FROM HealthCloudGA__Referral__c WHERE HealthCloudGA__MemberId__c = '${memberId}'`),
  ])
  return {
    claims: claims[0]?.cnt || 0,
    prescriptions: prescriptions[0]?.cnt || 0,
    referrals: referrals[0]?.cnt || 0,
  }
}

// ─── Provider API ─────────────────────────────────────────────────────────────

export async function getProviderProfile(npi) {
  if (USE_MOCK) return mockDelay(providerProfile)
  const records = await sfQuery(
    `SELECT Id, Name, HealthCloudGA__NPI__c, HealthCloudGA__Specialty__c, HealthCloudGA__DEANumber__c, TaxId__c, Phone, Fax, Email, BillingStreet, BillingCity, BillingState, BillingPostalCode FROM Account WHERE HealthCloudGA__NPI__c = '${npi}' AND RecordType.Name = 'Provider' LIMIT 1`
  )
  return records[0]
}

export async function getProviderPatients(npi) {
  if (USE_MOCK) return mockDelay(providerPatients)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__MemberId__c, Birthdate, HealthCloudGA__PlanName__c, HealthCloudGA__LastVisitDate__c, HealthCloudGA__PatientStatus__c FROM Contact WHERE HealthCloudGA__PCPNpi__c = '${npi}' ORDER BY Name ASC`
  )
}

export async function getProviderClaims(npi) {
  if (USE_MOCK) return mockDelay(providerClaims)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__ClaimId__c, HealthCloudGA__PatientName__c, HealthCloudGA__DateOfService__c, HealthCloudGA__CPTCodes__c, HealthCloudGA__BilledAmount__c, HealthCloudGA__PaidAmount__c, HealthCloudGA__ClaimStatus__c FROM HealthCloudGA__Claim__c WHERE HealthCloudGA__ProviderNPI__c = '${npi}' ORDER BY HealthCloudGA__DateOfService__c DESC`
  )
}

export async function getProviderPayments(npi) {
  if (USE_MOCK) return mockDelay(providerPayments)
  return sfQuery(
    `SELECT Id, Name, HealthCloudGA__ERANumber__c, HealthCloudGA__PaymentDate__c, HealthCloudGA__PaymentAmount__c, HealthCloudGA__ClaimsCount__c, HealthCloudGA__PaymentMethod__c FROM HealthCloudGA__Payment__c WHERE HealthCloudGA__ProviderNPI__c = '${npi}' ORDER BY HealthCloudGA__PaymentDate__c DESC`
  )
}

export async function getProviderDashboardStats(npi) {
  if (USE_MOCK) return mockDelay(providerDashboardStats)
  const [patients, pendingClaims, paidClaims] = await Promise.all([
    sfQuery(`SELECT COUNT(Id) cnt FROM Contact WHERE HealthCloudGA__PCPNpi__c = '${npi}'`),
    sfQuery(`SELECT COUNT(Id) cnt FROM HealthCloudGA__Claim__c WHERE HealthCloudGA__ProviderNPI__c = '${npi}' AND HealthCloudGA__ClaimStatus__c = 'Pending'`),
    sfQuery(`SELECT COUNT(Id) cnt FROM HealthCloudGA__Claim__c WHERE HealthCloudGA__ProviderNPI__c = '${npi}' AND HealthCloudGA__ClaimStatus__c = 'Paid'`),
  ])
  return {
    totalPatients: patients[0]?.cnt || 0,
    pendingClaims: pendingClaims[0]?.cnt || 0,
    paidClaims: paidClaims[0]?.cnt || 0,
  }
}
