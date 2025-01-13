import React, { forwardRef } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { IOrder } from '@/api/order/types';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import QrImg from '@/assets/img/tg-qr.jpg';

type Props = {
  order: IOrder;
};

export const MyDocument = forwardRef<any, Props>(({ order }, ref) => (
  <Document ref={ref}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.topData}>
          <View>
            <Text style={styles.title}>Xaridor: {order?.client?.name}</Text>
            <Text style={styles.title}>Xaridor raqami: {order?.client?.phone}</Text>
            <Text style={styles.title}>Sotuv vaqti: {getFullDateFormat(order?.sellingDate)}</Text>
          </View>
          <View>
            <Image src={QrImg} style={styles.qrImg} />
            <Text style={styles.qrTitle}>@SOHIBJON_IDEAL</Text>
          </View>
        </View>

        {/* Jadval */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>N</Text>
            <Text style={styles.tableHeaderCell}>Mahsulot nomi</Text>
            <Text style={styles.tableHeaderCell}>Soni</Text>
            <Text style={styles.tableHeaderCell}>Narxi</Text>
            <Text style={styles.tableHeaderCell}>Summasi</Text>
          </View>
          {
            order?.products?.map((product, index) => (
              <View key={product?.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>{product?.product?.name}</Text>
                <Text style={styles.tableCell}>{product?.count}</Text>
                <Text style={styles.tableCell}>{product?.price}</Text>
                <Text style={styles.tableCell}>{priceFormat(product?.count * product?.price)}</Text>
              </View>
            ))
          }
        </View>
        <View style={styles.totalCalc}>
          <Text style={styles.totalCalcText}>Jami narxi: {order?.sum}</Text>
          <Text style={styles.totalCalcText}>Jami to&lsquo;lov: {order?.payment?.totalPay || 0}</Text>
        </View>
      </View>
    </Page>
  </Document>
));

// PDF uchun stil
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  topData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  qrImg: {
    width: 70,
  },
  qrTitle: {
    fontSize: 8,
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
    color: '#1b3469',
  },
  content: {
    fontSize: 12,
    marginBottom: 20,
  },
  // Jadvalga tegishli stil
  table: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    padding: 5,
    borderRightWidth: 1,
    borderColor: 'black',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
    borderRightWidth: 1,
    borderColor: 'black',
    fontSize: 10,
  },
  totalCalc: {
    textAlign: 'right',
  },
  totalCalcText: {
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
});
