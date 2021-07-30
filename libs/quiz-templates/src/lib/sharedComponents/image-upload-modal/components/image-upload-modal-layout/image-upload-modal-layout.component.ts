import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedComponentService } from '../../../core/services/shared-component.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService, RequestApiService } from '@tce/core';

@Component({
  selector: 'app-image-upload-modal-layout',
  templateUrl: './image-upload-modal-layout.component.html',
  styleUrls: ['./image-upload-modal-layout.component.scss']
})
export class ImageUploadModalLayoutComponent implements OnInit, AfterViewInit {
  public imagePath;
  public imgURL;
  // linkImageUrl: string;
  public message: string;
  public imgHeight: number;
  public imgWidth: number;
  public imageLoad: boolean = false;
  public allowUpload: boolean = false;

  // @Input() imageModalOpen: BehaviorSubject<object>;
  // @Output() getImageData = new EventEmitter();
  public imageUploadform: FormGroup;
  @ViewChild('linkImg', { static: false }) public linkImg: ElementRef;
  @ViewChild('file', { static: false }) public file: ElementRef;
  @ViewChild('linkImgInput', { static: false }) public linkImgInput: ElementRef;
  // public componentType: string;
  public invalidWidth: boolean = false;
  public invalidHeight: boolean = false;
  public imageAllow: boolean = false;
  @Input() name: string;
  public wrongImage: boolean = false;
  public myFileUpload: any;
  public fileType: any;
  public converMBtoByte: any;
  public fileSize: any;
  public getFileName: any;
  public customFileName: any;
  public fileToUpload: any;
  public imageData: {};

  constructor(
    private modalService: NgxSmartModalService,
    private http: HttpClient,
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private toastrService: ToastrService,
    private appConfigService: AppConfigService,
    private requestApiService: RequestApiService
  ) {}

  ngOnInit() {
    this.fileType = this.appConfigService.getConfig('general')[
      'customResourceData'
    ]['addResourceFileType'];
    // let nameArray = this.name.split('-');
    // let name;
    // if(nameArray.length > 0) {

    // }
    //console.log('Type', this.name);

    this.initForm();

    this.sharedComponentService.imageModalOpen.subscribe(data => {
      //console.log('Image Upload Modal', data, this.name);
      if (data['state']) {
        if (this.name == data['name']) {
          this.modalService.getModal(this.name).open();
          this.resetForm();
          if (data['type']) {
            this.imageUploadform.get('componentType').setValue(data['type']);
          }

          if (data['name']) {
            this.imageUploadform.get('name').setValue(data['name']);
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    //Called on modal dismiss
    this.modalService
      .getModal(this.name)
      .onDismissFinished.subscribe((modal: NgxSmartModalComponent) => {
        this.closeModal();
      });

    //Called when modal has been closed by clicking on its backdrop
    this.modalService
      .getModal(this.name)
      .onCloseFinished.subscribe((modal: NgxSmartModalComponent) => {
        this.closeModal();
      });
  }

  initForm() {
    this.imageUploadform = new FormGroup({
      // altText: new FormControl('', []),
      // imageAlt: new FormControl('none', []),
      width: new FormControl(),
      height: new FormControl(),
      percent: new FormControl(),
      // widthPercent: new FormControl(),
      // heightPercent: new FormControl(),
      preventScaling: new FormControl(false, []),
      imageUrl: new FormControl([Validators.required]),
      componentType: new FormControl(null),
      name: new FormControl(null)
    });
  }

  /**
   * @description This function is triggered on modal close
   * @returns void
   */
  closeModal() {
    delete this.imgURL;
  }

  resetForm() {
    // if (this.linkImgInput.nativeElement) {
    //   this.linkImgInput.nativeElement.value = '';
    // }
    this.file.nativeElement.value = '';
    this.imageUploadform.get('width').reset();
    this.imageUploadform.get('height').reset();
    this.imageUploadform.get('imageUrl').reset();
  }

  /**
   * @description This function fetches the url entered by the user and previews it
   * @param event Type = Event
   * @returns void
   */
  getURL(): void {
    this.imgURL = this.linkImgInput.nativeElement.value;
    const image = {
      url: this.linkImgInput.nativeElement.value
    };
    this.imageLoad = true;

    this.setImageDimension(image);
  }

  /**
   * @description This function set the image url, height & width to the form from an observable call
   * @param image Type = object
   * @returns void
   */
  setImageDimension(image: object): void {
    this.getImageDimension(image).subscribe(response => {
      //console.log('response', response);
      this.imgHeight = response.height;
      this.imgWidth = response.width;
      this.imageUploadform.get('imageUrl').setValue(response.url);
      this.imageUploadform.get('height').setValue(this.imgHeight);
      this.imageUploadform.get('width').setValue(this.imgWidth);
      this.imageAllow = true;
      this.imageLoad = false;

      this.setWidth();
      this.setHeight();
    });
  }

  /**
   * @description This function creates a new image and sets its height, width and src
   * @param image Type = object
   * @returns Observable<any>
   */
  getImageDimension(image: object): Observable<any> {
    return new Observable(observer => {
      const img = new Image();
      img.onload = event => {
        const loadedImage: any = event.currentTarget;
        image['width'] = loadedImage.width;
        image['height'] = loadedImage.height;
        observer.next(image);
        observer.complete();
      };
      img.src = image['url'];
    });
  }

  /**
   *
   * @param files
   * Function to retrieve the file uploaded by the user and show a preview of the image
   * @returns void
   */
  // preview(files): void {
  //   this.imageAllow = false;
  //   if (files.length === 0) return;

  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = 'Only images are supported.';
  //     return;
  //   }
  //   this.imageLoad = true;

  //   var reader = new FileReader();
  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]);
  //   reader.onload = _event => {
  //     this.imgURL = reader.result;
  //   };

  //   //For temporary testing purposes
  //   let IMGUR_CLIENT_ID = 'cb7f77c7f03654e';
  //   var header = {
  //     headers: new HttpHeaders().set(
  //       'Authorization',
  //       'Client-ID ' + IMGUR_CLIENT_ID
  //     )
  //   };

  //   let formData = new FormData();
  //   formData.append('image', this.imagePath[0]);
  //   this.wrongImage = false;
  //   this.http.post('https://api.imgur.com/3/image', formData, header).subscribe(
  //     res => {
  //       this.renderer.setProperty(this.linkImgInput.nativeElement, 'value', '');

  //       const image: object = {
  //         url: res['data'].link
  //       };

  //       this.setImageDimension(image);
  //     },
  //     err => {
  //       this.wrongImage = true;
  //       this.imageLoad = false;
  //       console.log(err);
  //       this.imageAllow = false;
  //     }
  //   );
  // }

  async upload(files: FileList) {
    console.log('upload called', files);

    // this.closeKeyboard();
    //console.log('uploadFiles  ', files);
    if (
      files[0].type === 'image/png' ||
      files[0].type === 'image/jpg' ||
      files[0].type === 'image/jpeg'
    ) {
      this.converMBtoByte = Number(this.fileSize) * 1048576;
      if (files && files[0]) {
        var reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = _event => {
          this.imgURL = reader.result;
        };
        const fileNameExtn =
          '.' +
          files[0].name
            .split('.')
            .pop()
            .toLowerCase();
        const arrFiletype = this.fileType.split(',');
        let showEtnMessage = await this.getExtationFlag(
          arrFiletype,
          fileNameExtn
        );

        if (!showEtnMessage) {
          if (files[0].size >= this.converMBtoByte) {
            this.myFileUpload = '';
            this.toastrService.error(
              'File Size Should Be Less Than Or Equal To ' +
                this.fileSize +
                ' MB'
            );
          } else {
            this.getFileName = files[0].name;
            this.myFileUpload = files.item(0);
          }
        } else {
          this.getFileName = this.customFileName;
          this.toastrService.error('Invalid File Extention');
        }
      } else {
        this.getFileName = this.customFileName;
        this.toastrService.error('File Required');
      }
      this.uploadImage1(this.myFileUpload);
    } else {
      this.toastrService.error('Cant upload. Only Image file is allowed!');
    }
  }

  async getExtationFlag(arr, currentExtn) {
    let xyz = true;
    arr.forEach(element => {
      if (element == currentExtn) {
        xyz = false;
      }
    });
    return xyz;
  }

  uploadImage1(file: FileList) {
    this.fileToUpload = file;
    console.log('uploadImage1', this.fileToUpload);

    let formData: FormData = new FormData();

    formData.append('lpFile', this.fileToUpload);
    if (this.fileToUpload) {
      this.http
        .post(this.requestApiService.getUrl('addResource'), formData)
        .subscribe(fileResponse => {
          console.log('uploadImage1', fileResponse);

          if (fileResponse) {
            // console.log('fileResponse ', fileResponse, this.imgURL);
            let image: object = {
              fileName: fileResponse['fileName'],
              folder: fileResponse['folder'],
              tempImgPath: this.imgURL
            };
            this.imageData = image;
            if (this.imgURL) {
              this.allowUpload = true;
            }
            // this.sharedComponentService.getImageDataService(this.imageData);
            // this.imageData['folder'] = fileResponse['folder'];
            // console.log('imageForm ', this.imageUploadform.value);

            // this.setImageDimension(image);
          }
        });
    }
  }

  close() {
    this.imageAllow = false;
    this.wrongImage = false;
  }

  uploadImage(): void {
    if (this.imagePath) {
      this.initForm();
      // this.sharedComponentService.imageModalOpen.next(
      //   this.imageUploadform.value
      // );
      this.sharedComponentService.imageModalOpen.next({});
      this.sharedComponentService.getImageDataService(this.imageData);

      this.modalService.getModal(this.name).close();
    } else {
      this.sharedComponentService.getImageDataService(
        this.imageUploadform.value
      );
      this.initForm();
      this.sharedComponentService.imageModalOpen.next({});
      this.modalService.getModal(this.name).close();
    }
  }

  /**
   * @description set width by percentage
   * @returns void
   */
  setPercentWidth() {
    var pWidth = this.imageUploadform.value.percent.toFixed();
    var newWidth = (this.imgWidth * (pWidth / 100)).toFixed();
    this.imageUploadform.get('width').setValue(newWidth);
    this.setWidth();
  }

  /**
   * @description set height by percentage
   * @returns void
   */
  setPercentHeight() {
    var pHeight = this.imageUploadform.value.percent.toFixed();
    var newHeight = (this.imgHeight * (pHeight / 100)).toFixed();
    this.imageUploadform.get('height').setValue(newHeight);
    this.setHeight();
  }

  /**
   * @description set width by input
   * @returns void
   */
  setWidth(): void {
    //console.log('Width', this.imageUploadform.value.width);
    // Math.round(this.imageUploadform.value.width * 100) / 100
    var width = this.imageUploadform.value.width;
    var newWidth = ((width / this.imgWidth) * 100).toFixed();
    if (width > this.imgWidth) {
      this.invalidWidth = true;
      // this.imageUploadform.get('width').setValue(this.imgWidth);
    } else {
      this.invalidWidth = false;
      var height = width * (this.imgHeight / this.imgWidth);
      //new height in input
      this.imageUploadform.get('height').setValue(height.toFixed());
      var newHeight = ((height / this.imgHeight) * 100).toFixed();
      //new height width in percentage
      this.imageUploadform.get('percent').setValue(newHeight);
      this.imageUploadform.get('percent').setValue(newWidth);
      // this.setPercentWidth();
    }
  }

  // roundDecimal(number): number {
  //   return Math.round(number * 100) / 100
  // }

  /**
   * @description set height by input
   * @return void
   */
  setHeight() {
    var height = this.imageUploadform.value.height;
    var newHeight = ((height / this.imgHeight) * 100).toFixed();
    if (height > this.imgHeight) {
      this.invalidHeight = true;
      // this.imageUploadform.get('height').setValue(this.imgHeight);
    } else {
      this.invalidHeight = false;
      var width = height * (this.imgWidth / this.imgHeight);
      //new width in input
      this.imageUploadform.get('width').setValue(width.toFixed());
      var newWidth = ((width / this.imgWidth) * 100).toFixed();
      // new height width in percentage
      this.imageUploadform.get('percent').setValue(newWidth);
      this.imageUploadform.get('percent').setValue(newHeight);

      // console.log(
      //   this.imageUploadform.get('percent'),
      //   this.imageUploadform.get('percent')
      // );
      // this.setPercentHeight();
    }
  }

  closeImageModal() {
    this.modalService.getModal(this.name).close();
  }
}
